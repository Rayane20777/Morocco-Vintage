package com.example.vintage.mapper;

import com.example.vintage.dto.request.ProductRequestDTO;
import com.example.vintage.dto.response.ProductResponseDTO;
import com.example.vintage.model.Product;
import org.mapstruct.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    @Mapping(target = "image", ignore = true)
    @Mapping(source = "bought_price", target = "bought_price")
    void updateProductFromDto(ProductRequestDTO dto, @MappingTarget Product product);

    @Mapping(source = "bought_price", target = "bought_price")
    @Mapping(source = "image", target = "image", qualifiedByName = "byteArrayToString")
    ProductResponseDTO toDto(Product product);

    @Named("multipartFileToString")
    default String multipartFileToString(MultipartFile file) {
        if (file == null) {
            return null;
        }
        return file.getOriginalFilename();
    }

    @Named("byteArrayToString")
    default String byteArrayToString(byte[] bytes) {
        if (bytes == null) {
            return null;
        }
        return Base64.getEncoder().encodeToString(bytes);
    }
}