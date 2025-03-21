package com.example.vintage.mapper;

import com.example.vintage.dto.request.VinylRequestDTO;
import com.example.vintage.dto.response.VinylResponseDTO;
import com.example.vintage.model.Vinyl;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Date;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, imports = {Date.class})
public interface VinylMapper {

    @Mapping(target = "dateAdded", expression = "java(new Date())")
    @Mapping(target = "image", ignore = true)
    @Mapping(source = "bought_price", target = "bought_price")
    @Mapping(target = "type", constant = "VINYL")
    Vinyl toEntity(VinylRequestDTO dto);

    @Mapping(source = "bought_price", target = "bought_price")
    @Mapping(target = "type", constant = "VINYL")
    VinylResponseDTO toDto(Vinyl vinyl);

    @Mapping(source = "bought_price", target = "bought_price")
    @Mapping(target = "type", constant = "VINYL")
    void updateVinylFromDto(VinylRequestDTO dto, @MappingTarget Vinyl vinyl);

    default byte[] map(MultipartFile value) {
        if (value != null) {
            try {
                return value.getBytes();
            } catch (IOException e) {
                throw new RuntimeException("Failed to convert MultipartFile to byte array", e);
            }
        }
        return null;
    }

    default String map(byte[] value) {
        return value != null ? Base64.getEncoder().encodeToString(value) : null;
    }
} 