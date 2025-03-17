package com.example.vintage.dto.request;

import com.example.vintage.model.enums.MusicEquipmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class MusicEquipmentRequestDTO extends ProductRequestDTO {
    @NotBlank(message = "Model is required")
    private String model;
    
    @NotNull(message = "Equipment condition is required")
    private MusicEquipmentStatus equipmentCondition;
    
    @NotBlank(message = "Material is required")
    private String material;
    
    @NotBlank(message = "Origin is required")
    private String origin;
} 