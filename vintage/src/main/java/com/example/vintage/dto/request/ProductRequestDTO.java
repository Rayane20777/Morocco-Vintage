package com.example.vintage.dto.request;

import com.example.vintage.model.enums.ProductStatus;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class ProductRequestDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal bought_price;
    private int year;
    private ProductStatus status;
    private MultipartFile image;
}