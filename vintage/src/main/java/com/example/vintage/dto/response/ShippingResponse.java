package com.example.vintage.dto.response;

import com.example.vintage.model.enums.ShippingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingResponse {
    private String id;
    private String address;
    private String city;
    private String postalCode;
    private ShippingStatus status;
    private String trackingNumber;
} 