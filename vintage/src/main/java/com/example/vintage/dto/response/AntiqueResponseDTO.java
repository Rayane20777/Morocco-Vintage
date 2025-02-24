package com.example.vintage.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AntiqueResponseDTO extends ProductResponseDTO {
    private String typeId;
    private String origin;
    private String material;
    private String condition;
} 