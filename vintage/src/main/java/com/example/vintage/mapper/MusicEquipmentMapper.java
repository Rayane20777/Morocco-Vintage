package com.example.vintage.mapper;

import com.example.vintage.dto.request.MusicEquipmentRequestDTO;
import com.example.vintage.dto.response.MusicEquipmentResponseDTO;
import com.example.vintage.model.MusicEquipment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.web.multipart.MultipartFile;

@Mapper(componentModel = "spring")
public interface MusicEquipmentMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAdded", ignore = true)
    @Mapping(target = "image", ignore = true)
    MusicEquipment toEntity(MusicEquipmentRequestDTO dto);
    
    MusicEquipmentResponseDTO toDto(MusicEquipment entity);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAdded", ignore = true)
    @Mapping(target = "image", ignore = true)
    void updateEntityFromDto(MusicEquipmentRequestDTO dto, @MappingTarget MusicEquipment entity);

    default String map(MultipartFile value) {
        return null; // Image handling is done in service layer
    }
} 