package com.example.vintage.model;

import com.example.vintage.model.enums.ShippingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "shipping")
public class Shipping {
    @Id
    private String id;
    private String address;
    private String city;
    private String postalCode;
    private ShippingStatus status;
    private String trackingNumber;
}

