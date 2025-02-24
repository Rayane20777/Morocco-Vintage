package com.example.vintage.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AntiqueRequestDTO extends ProductRequestDTO {
    @NotBlank(message = "Type ID is required")
    private String typeId; // ID of the antique type
    // Add any antique-specific fields here
    @NotBlank(message = "Origin is required")
    private String origin;
    @NotBlank(message = "Material is required")
    private String material;
    @NotBlank(message = "Condition is required")
    private String condition;
} 