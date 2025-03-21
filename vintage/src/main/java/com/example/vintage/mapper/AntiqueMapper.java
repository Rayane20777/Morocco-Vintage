package com.example.vintage.mapper;

import com.example.vintage.dto.request.AntiqueRequestDTO;
import com.example.vintage.dto.response.AntiqueResponseDTO;
import com.example.vintage.model.Antique;
import org.mapstruct.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Date;

@Mapper(componentModel = "spring", imports = {Date.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AntiqueMapper {

    @Mapping(target = "bought_price", source = "bought_price")
    @Mapping(target = "type", constant = "ANTIQUE")
    AntiqueResponseDTO toResponseDTO(Antique antique);

    @Mapping(target = "image", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAdded", expression = "java(new java.util.Date())")
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "bought_price", source = "bought_price")
    @Mapping(target = "type", constant = "ANTIQUE")
    Antique toEntity(AntiqueRequestDTO dto) throws IOException;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAdded", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "bought_price", source = "bought_price")
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "type", constant = "ANTIQUE")
    void updateEntity(AntiqueRequestDTO dto, @MappingTarget Antique entity) throws IOException;

    @Named("byteArrayToBase64")
    default String byteArrayToBase64(byte[] image) {
        return image != null ? Base64.getEncoder().encodeToString(image) : null;
    }

    @Named("multipartFileToByteArray")
    default byte[] multipartFileToByteArray(MultipartFile file) throws IOException {
        return file != null ? file.getBytes() : null;
    }
}



