package com.example.vintage.mapper;

import com.example.vintage.dto.request.AntiqueRequestDTO;
import com.example.vintage.dto.response.AntiqueResponseDTO;
import com.example.vintage.entity.Antique;
import org.mapstruct.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Date;

@Mapper(componentModel = "spring", uses = {ProductMapper.class}, imports = {Date.class})
public interface AntiqueMapper {

    @Mapping(target = "image", expression = "java(byteArrayToBase64(antique.getImage()))")
    @Mapping(target = "bought_price", source = "boughtPrice")
    AntiqueResponseDTO toResponseDTO(Antique antique);

    @Mapping(target = "image", expression = "java(multipartFileToByteArray(dto.getImage()))")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAdded", expression = "java(new java.util.Date())")
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "boughtPrice", source = "bought_price")
    Antique toEntity(AntiqueRequestDTO dto) throws IOException;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAdded", ignore = true)
    @Mapping(target = "image", expression = "java(multipartFileToByteArray(dto.getImage()))")
    @Mapping(target = "boughtPrice", source = "bought_price")
    @Mapping(target = "active", ignore = true)
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



