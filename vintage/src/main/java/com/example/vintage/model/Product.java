package com.example.vintage.model;

import com.example.vintage.model.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    
    @Field("price")
    private String priceStr;
    
    @Transient
    private BigDecimal price;
    
    @Field("bought_price")
    private String boughtPriceStr;
    
    @Transient
    private BigDecimal bought_price;
    
    private int year;
    private ProductStatus status;
    private String image;
    private boolean active;
    private String type;
    
    @Field("dateAdded")
    private Date dateAdded;

    public BigDecimal getPrice() {
        if (price == null && priceStr != null && !priceStr.isEmpty()) {
            try {
                price = new BigDecimal(priceStr);
            } catch (NumberFormatException e) {
                price = BigDecimal.ZERO;
            }
        }
        return price != null ? price : BigDecimal.ZERO;
    }

    public void setPrice(String price) {
        this.priceStr = price;
        if (price != null && !price.isEmpty()) {
            try {
                this.price = new BigDecimal(price);
            } catch (NumberFormatException e) {
                this.price = BigDecimal.ZERO;
            }
        }
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
        this.priceStr = price != null ? price.toString() : "0.00";
    }

    public BigDecimal getBought_price() {
        if (bought_price == null && boughtPriceStr != null && !boughtPriceStr.isEmpty()) {
            try {
                bought_price = new BigDecimal(boughtPriceStr);
            } catch (NumberFormatException e) {
                bought_price = BigDecimal.ZERO;
            }
        }
        return bought_price != null ? bought_price : BigDecimal.ZERO;
    }

    public void setBought_price(String price) {
        this.boughtPriceStr = price;
        if (price != null && !price.isEmpty()) {
            try {
                this.bought_price = new BigDecimal(price);
            } catch (NumberFormatException e) {
                this.bought_price = BigDecimal.ZERO;
            }
        }
    }

    public void setBought_price(BigDecimal price) {
        this.bought_price = price;
        this.boughtPriceStr = price != null ? price.toString() : "0.00";
    }
}