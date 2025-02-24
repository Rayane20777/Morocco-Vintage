package com.example.vintage.service.Interface;

import com.example.vintage.dto.request.MusicEquipmentRequestDTO;
import com.example.vintage.dto.response.MusicEquipmentResponseDTO;

import java.util.List;

public interface MusicEquipmentService {
    MusicEquipmentResponseDTO createMusicEquipment(MusicEquipmentRequestDTO dto);
    MusicEquipmentResponseDTO updateMusicEquipment(String id, MusicEquipmentRequestDTO dto);
    void deleteMusicEquipment(String id);
    MusicEquipmentResponseDTO getMusicEquipmentById(String id);
    List<MusicEquipmentResponseDTO> getAllMusicEquipment();
} 