package com.example.vintage.service.Implementation;

import com.example.vintage.dto.request.MusicEquipmentRequestDTO;
import com.example.vintage.dto.response.MusicEquipmentResponseDTO;
import com.example.vintage.exception.ResourceNotFoundException;
import com.example.vintage.mapper.MusicEquipmentMapper;
import com.example.vintage.model.MusicEquipment;
import com.example.vintage.model.Product;
import com.example.vintage.repository.MusicEquipmentRepository;
import com.example.vintage.repository.ProductRepository;
import com.example.vintage.service.GridFsService;
import com.example.vintage.service.Interface.MusicEquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MusicEquipmentServiceImpl implements MusicEquipmentService {

    private final MusicEquipmentRepository musicEquipmentRepository;
    private final MusicEquipmentMapper musicEquipmentMapper;
    private final GridFsService gridFsService;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public MusicEquipmentResponseDTO createMusicEquipment(MusicEquipmentRequestDTO dto) {
        MusicEquipment musicEquipment = musicEquipmentMapper.toEntity(dto);
        
        // Handle image upload using GridFS
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String imageId = gridFsService.saveFile(dto.getImage());
            musicEquipment.setImage(imageId);
        }
        
        MusicEquipment savedEquipment = musicEquipmentRepository.save(musicEquipment);
        return musicEquipmentMapper.toDto(savedEquipment);
    }

    @Override
    @Transactional
    public MusicEquipmentResponseDTO updateMusicEquipment(String id, MusicEquipmentRequestDTO dto) {
        MusicEquipment existingEquipment = musicEquipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Music Equipment not found with id: " + id));

        // Handle image update using GridFS
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String newImageId = gridFsService.updateFile(existingEquipment.getImage(), dto.getImage());
            existingEquipment.setImage(newImageId);
        }

        musicEquipmentMapper.updateEntityFromDto(dto, existingEquipment);
        MusicEquipment updatedEquipment = musicEquipmentRepository.save(existingEquipment);
        return musicEquipmentMapper.toDto(updatedEquipment);
    }

    @Override
    @Transactional
    public void deleteMusicEquipment(String id) {
        MusicEquipment equipment = musicEquipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Music Equipment not found with id: " + id));

        // Delete image from GridFS if it exists
        if (equipment.getImage() != null) {
            gridFsService.deleteFile(equipment.getImage());
        }

        musicEquipmentRepository.deleteById(id);
    }

    @Override
    public MusicEquipmentResponseDTO getMusicEquipmentById(String id) {
        MusicEquipment equipment = musicEquipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Music Equipment not found with id: " + id));
        return musicEquipmentMapper.toDto(equipment);
    }

    @Override
    public List<MusicEquipmentResponseDTO> getAllMusicEquipment() {
      List<Product> products = productRepository.findByType("MUSIC_EQUIPMENT");
        return products.stream()
                .map(product -> musicEquipmentMapper.toDto((MusicEquipment) product))
                .collect(Collectors.toList());
    }
} 