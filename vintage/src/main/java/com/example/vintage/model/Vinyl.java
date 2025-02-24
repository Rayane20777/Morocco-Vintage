package com.example.vintage.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@EqualsAndHashCode(callSuper = true)
@Document(collection = "products")
public class Vinyl extends Product {

    private Long discogsId;
    private Long instanceId;
    private List<String> artists;
    private List<String> genres;
    private List<String> styles;
    private List<String> format;
    private String thumbImageUrl;
    private String coverImageUrl;
    private Boolean active = true;
    private String coverImage;
    private String thumb;
    
    // Add a discriminator field to identify the type of product
    private final String type = "VINYL";
} 