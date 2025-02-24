package com.example.vintage.service.Implementation;

import com.example.vintage.dto.request.MusicEquipmentRequestDTO;
import com.example.vintage.dto.response.MusicEquipmentResponseDTO;
import com.example.vintage.exception.ResourceNotFoundException;
import com.example.vintage.mapper.MusicEquipmentMapper;
import com.example.vintage.model.MusicEquipment;
import com.example.vintage.repository.MusicEquipmentRepository;
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

    @Override
    @Transactional
    public MusicEquipmentResponseDTO createMusicEquipment(MusicEquipmentRequestDTO dto) {
        MusicEquipment musicEquipment = musicEquipmentMapper.toEntity(dto);
        MusicEquipment savedEquipment = musicEquipmentRepository.save(musicEquipment);
        return musicEquipmentMapper.toDto(savedEquipment);
    }

    @Override
    @Transactional
    public MusicEquipmentResponseDTO updateMusicEquipment(String id, MusicEquipmentRequestDTO dto) {
        MusicEquipment existingEquipment = musicEquipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Music Equipment not found with id: " + id));

        musicEquipmentMapper.updateEntityFromDto(dto, existingEquipment);
        MusicEquipment updatedEquipment = musicEquipmentRepository.save(existingEquipment);
        return musicEquipmentMapper.toDto(updatedEquipment);
    }

    @Override
    @Transactional
    public void deleteMusicEquipment(String id) {
        if (!musicEquipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Music Equipment not found with id: " + id);
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
        return musicEquipmentRepository.findAll().stream()
                .map(musicEquipmentMapper::toDto)
                .collect(Collectors.toList());
    }
} 