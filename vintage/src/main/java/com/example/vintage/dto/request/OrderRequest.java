package com.example.vintage.dto.request;

import com.example.vintage.model.enums.PaymentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    @NotNull(message = "Client ID is required")
    private String clientId;
    
    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;
    
    @Valid
    @NotNull(message = "Shipping information is required")
    private ShippingRequest shipping;
    
    @Valid
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequest> items;
    
    @Data
    public static class OrderItemRequest {
        @NotNull(message = "Product ID is required")
        private String productId;
    }
    
    @Data
    public static class ShippingRequest {
        @NotNull(message = "Address is required")
        private String address;
        
        @NotNull(message = "City is required")
        private String city;
        
        @NotNull(message = "Postal code is required")
        private String postalCode;
    }
} 