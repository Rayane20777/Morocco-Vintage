package com.example.vintage.model;

import com.example.vintage.model.enums.ProductStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Document
public abstract class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal bought_price;
    private int year;
    private ProductStatus status;
    @Field("product_image")
    private byte[] image; // Store image as binary data
    private boolean active;
    
    @Field("dateAdded")
    private Date dateAdded;
}