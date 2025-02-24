package com.example.vintage.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Document(collection = "products")
public abstract class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal boughtPrice;
    private int year;
    private String status;
    @Field("product_image")
    private byte[] image; // Store image as binary data
    private boolean active;
    private Date dateAdded;
}