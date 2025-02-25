package com.example.vintage.service.Implementation;

import com.example.vintage.dto.request.AntiqueRequestDTO;
import com.example.vintage.dto.response.AntiqueResponseDTO;
import com.example.vintage.model.Antique;
import com.example.vintage.exception.ResourceNotFoundException;
import com.example.vintage.mapper.AntiqueMapper;
import com.example.vintage.repository.AntiqueRepository;
import com.example.vintage.service.Interface.AntiqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import com.example.vintage.service.GridFsService;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AntiqueServiceImpl implements AntiqueService {

    private final AntiqueRepository antiqueRepository;
    private final AntiqueMapper antiqueMapper;
    private final GridFsService gridFsService;

    @Override
    public List<AntiqueResponseDTO> getAllAntiques() {
        return antiqueRepository.findAll().stream()
                .map(antiqueMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AntiqueResponseDTO getAntiqueById(String id) {
        return antiqueMapper.toResponseDTO(
                antiqueRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Antique not found with id: " + id))
        );
    }

    @Override
    public AntiqueResponseDTO createAntique(AntiqueRequestDTO dto) {
        try {
            log.info("Creating antique with DTO: {}", dto);
            Antique antique = antiqueMapper.toEntity(dto);
            
            // Handle image upload
            if (dto.getImage() != null && !dto.getImage().isEmpty()) {
                log.info("Image found in request, processing upload...");
                String imageId = gridFsService.saveFile(dto.getImage());
                log.info("Image saved with ID: {}", imageId);
                antique.setImage(imageId);
            } else {
                log.warn("No image found in request or image is empty");
                if (dto.getImage() == null) {
                    log.warn("Image is null");
                } else {
                    log.warn("Image is empty: isEmpty={}", dto.getImage().isEmpty());
                }
            }
            
            Antique savedAntique = antiqueRepository.save(antique);
            log.info("Saved antique: {}", savedAntique);
            return antiqueMapper.toResponseDTO(savedAntique);
        } catch (Exception e) {
            log.error("Error creating antique: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create antique", e);
        }
    }

    @Override
    public AntiqueResponseDTO updateAntique(String id, AntiqueRequestDTO dto) throws IOException {
        Antique existingAntique = antiqueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Antique not found with id: " + id));

        antiqueMapper.updateEntity(dto, existingAntique);
        
        // Handle image upload
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            try {
                // Delete old image if exists
                if (existingAntique.getImage() != null) {
                    gridFsService.deleteFile(existingAntique.getImage());
                }
                String imageId = gridFsService.saveFile(dto.getImage());
                existingAntique.setImage(imageId);
            } catch (Exception e) {
                log.error("Error updating antique image: {}", e.getMessage());
            }
        }

        Antique updatedAntique = antiqueRepository.save(existingAntique);
        return antiqueMapper.toResponseDTO(updatedAntique);
    }

    @Override
    public void deleteAntique(String id) {
        Antique antique = antiqueRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Antique not found with id: " + id));
        
        // Delete associated image if exists
        if (antique.getImage() != null) {
            try {
                gridFsService.deleteFile(antique.getImage());
            } catch (Exception e) {
                log.error("Error deleting antique image: {}", e.getMessage());
            }
        }
        
        antiqueRepository.deleteById(id);
    }
} 