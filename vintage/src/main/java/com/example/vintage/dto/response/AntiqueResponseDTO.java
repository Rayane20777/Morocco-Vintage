package com.example.vintage.dto.response;

import com.example.vintage.entity.enums.ProductStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class AntiqueResponseDTO extends ProductResponseDTO {
    private String typeId;
    private String origin;
    private String material;
    private String condition;
} 