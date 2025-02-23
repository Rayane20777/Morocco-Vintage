package com.example.vintage.entity;

import com.example.vintage.entity.enums.MusicEquipmentStatus;
import lombok.Data;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@TypeAlias("music_equipment")
public class MusicEquipment extends Product {
    private String model;
    private MusicEquipmentStatus equipmentCondition;
    private String material;
    private String origin;
} 