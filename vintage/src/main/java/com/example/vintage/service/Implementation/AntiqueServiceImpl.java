package com.example.vintage.service.Implementation;

import com.example.vintage.dto.request.AntiqueRequestDTO;
import com.example.vintage.dto.response.AntiqueResponseDTO;
import com.example.vintage.entity.Antique;
import com.example.vintage.exception.ResourceNotFoundException;
import com.example.vintage.mapper.AntiqueMapper;
import com.example.vintage.repository.AntiqueRepository;
import com.example.vintage.service.Interface.AntiqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AntiqueServiceImpl implements AntiqueService {

    private final AntiqueRepository antiqueRepository;
    private final AntiqueMapper antiqueMapper;

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
    public AntiqueResponseDTO createAntique(AntiqueRequestDTO antiqueRequestDTO) throws IOException {
        Antique antique = antiqueMapper.toEntity(antiqueRequestDTO);
        return antiqueMapper.toResponseDTO(antiqueRepository.save(antique));
    }

    @Override
    public AntiqueResponseDTO updateAntique(String id, AntiqueRequestDTO antiqueRequestDTO) throws IOException {
        Antique existingAntique = antiqueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Antique not found with id: " + id));

        antiqueMapper.updateEntity(antiqueRequestDTO, existingAntique);
        Antique updatedAntique = antiqueRepository.save(existingAntique);
        return antiqueMapper.toResponseDTO(updatedAntique);
    }

    @Override
    public void deleteAntique(String id) {
        antiqueRepository.deleteById(id);
    }
} 