package com.example.vintage.model;

import com.example.vintage.model.enums.MusicEquipmentStatus;
import lombok.Data;
import org.springframework.data.annotation.TypeAlias;

@Data
@TypeAlias("music_equipment")
public class MusicEquipment extends Product {
    private String model;
    private MusicEquipmentStatus equipmentCondition;
    private String material;
    private String origin;
} 