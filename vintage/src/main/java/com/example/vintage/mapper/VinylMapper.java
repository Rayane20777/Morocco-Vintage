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

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface VinylMapper {

    @Mapping(source = "bought_price", target = "bought_price")
    Vinyl toEntity(VinylRequestDTO dto);

    @Mapping(source = "bought_price", target = "bought_price")
    VinylResponseDTO toDto(Vinyl vinyl);

    @Mapping(source = "bought_price", target = "bought_price")
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