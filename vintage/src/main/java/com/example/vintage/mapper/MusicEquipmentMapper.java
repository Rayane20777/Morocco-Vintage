package com.example.vintage.mapper;

import com.example.vintage.dto.request.MusicEquipmentRequestDTO;
import com.example.vintage.dto.response.MusicEquipmentResponseDTO;
import com.example.vintage.model.MusicEquipment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Mapper(componentModel = "spring")
public interface MusicEquipmentMapper {
    
    @Mapping(target = "id", ignore = true)
    MusicEquipment toEntity(MusicEquipmentRequestDTO dto);
    
    MusicEquipmentResponseDTO toDto(MusicEquipment entity);
    
    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(MusicEquipmentRequestDTO dto, @MappingTarget MusicEquipment entity);

    default byte[] map(MultipartFile value) {
        try {
            return value != null ? value.getBytes() : null;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image file", e);
        }
    }

    default String map(byte[] value) {
        return value != null ? Base64.getEncoder().encodeToString(value) : null;
    }
} 