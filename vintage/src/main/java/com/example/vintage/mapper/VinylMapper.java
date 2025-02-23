package com.example.vintage.mapper;

import com.example.vintage.dto.request.VinylRequestDTO;
import com.example.vintage.dto.response.VinylResponseDTO;
import com.example.vintage.entity.Vinyl;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Mapper(componentModel = "spring")
public interface VinylMapper {

    VinylMapper INSTANCE = Mappers.getMapper(VinylMapper.class);

    @Mapping(target = "image", source = "image")
    Vinyl toEntity(VinylRequestDTO dto);

    VinylResponseDTO toResponseDTO(Vinyl vinyl);

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