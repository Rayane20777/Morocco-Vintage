package com.example.vintage.dto.response;

import com.example.vintage.model.enums.OrderStatus;
import com.example.vintage.model.enums.PaymentType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class OrderResponse {
    private String id;
    private Date orderDate;
    private OrderStatus orderStatus;
    private BigDecimal totalAmount;
    private PaymentType paymentType;
    private String clientId;
    private String clientName;
    private List<OrderItemResponse> items;
    private ShippingResponse shipping;
    
    @Data
    public static class OrderItemResponse {
        private String id;
        private String productId;
        private String productName;
        private BigDecimal price;
    }
    
    @Data
    public static class ShippingResponse {
        private String id;
        private String address;
        private String city;
        private String postalCode;
        private String status;
        private String trackingNumber;
    }
}