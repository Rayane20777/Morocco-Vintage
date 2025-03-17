package com.example.vintage.model;

import com.example.vintage.model.enums.MusicEquipmentStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;
@Data
@Document(collection = "products")
@EqualsAndHashCode(callSuper = true)
public class MusicEquipment extends Product {
    private String model;
    private MusicEquipmentStatus equipmentCondition;
    private String material;
    private String origin;

    
        public MusicEquipment() {
        super();
        setType("MUSIC_EQUIPMENT");
    }

      @Override
    public void setType(String type) {
        super.setType("MUSIC_EQUIPMENT");
    }
}