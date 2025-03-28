package com.example.vintage.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "products")
@EqualsAndHashCode(callSuper = true)
public class Antique extends Product {
    private String typeId;
    private String origin;
    private String material;
    private String condition;
    private String designer;

    public Antique() {
        super();
        setType("ANTIQUE");
    }

    @Override
    public void setType(String type) {
        super.setType("ANTIQUE");
    }
} 