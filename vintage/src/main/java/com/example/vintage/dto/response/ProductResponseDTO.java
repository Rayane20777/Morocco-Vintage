package com.example.vintage.dto.response;

import com.example.vintage.entity.enums.ProductStatus;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductResponseDTO {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal bought_price;
    private int year;
    private ProductStatus status;
    private String image;
} 