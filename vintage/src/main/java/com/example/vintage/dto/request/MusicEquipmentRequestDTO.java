package com.example.vintage.dto.request;

import com.example.vintage.model.enums.MusicEquipmentStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class MusicEquipmentRequestDTO extends ProductRequestDTO {
    private String model;
    private MusicEquipmentStatus equipmentCondition;
    private String material;
    private String origin;
} 