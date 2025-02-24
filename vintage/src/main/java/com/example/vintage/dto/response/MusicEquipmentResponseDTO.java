package com.example.vintage.dto.response;

import com.example.vintage.model.enums.MusicEquipmentStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class MusicEquipmentResponseDTO extends ProductResponseDTO {
    private String model;
    private MusicEquipmentStatus equipmentCondition;
    private String material;
    private String origin;
} 