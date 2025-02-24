package com.example.vintage.mapper;

import com.example.vintage.dto.request.ProductRequestDTO;
import com.example.vintage.dto.response.ProductResponseDTO;
import com.example.vintage.entity.Product;
import org.mapstruct.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "image", expression = "java(byteArrayToBase64(product.getImage()))")
    @Mapping(target = "bought_price", source = "boughtPrice")
    ProductResponseDTO toResponseDTO(Product product);

    @Named("mapCommonProductFields")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "boughtPrice", source = "bought_price")
    @Mapping(target = "year", source = "year")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "dateAdded", expression = "java(new java.util.Date())")
    void mapCommonFields(ProductRequestDTO source, @MappingTarget Product target);

    @Named("byteArrayToBase64")
    default String byteArrayToBase64(byte[] image) {
        return image != null ? Base64.getEncoder().encodeToString(image) : null;
    }

    @Named("multipartFileToByteArray")
    default byte[] multipartFileToByteArray(MultipartFile file) throws IOException {
        return file != null ? file.getBytes() : null;
    }
}