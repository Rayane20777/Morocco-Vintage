package com.example.vintage.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "antique_types")
public class AntiqueType {
    @Id
    private String id;
    private String name; // Name of the antique type
} 