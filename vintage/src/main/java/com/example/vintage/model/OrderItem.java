package com.example.vintage.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Data
@Document(collection = "orderItems")
public class OrderItem {
    @Id
    private String id;
    
    @DBRef
    private Product product;
    
    @DBRef
    private Order order;
    
    private BigDecimal price;
}