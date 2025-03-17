package com.example.vintage.model;

import com.example.vintage.model.enums.OrderStatus;
import com.example.vintage.model.enums.PaymentType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    
    private Date orderDate = new Date();
    
    private OrderStatus orderStatus = OrderStatus.PENDING;
    
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    private PaymentType paymentType;
    
    @DBRef
    private User client;
    
    @DBRef
    private List<OrderItem> orderItems = new ArrayList<>();
    
    @DBRef
    private Shipping shipping;
    
    public void calculateTotal() {
        this.totalAmount = orderItems.stream()
            .map(OrderItem::getPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public void addItem(OrderItem item) {
        orderItems.add(item);
        calculateTotal();
    }
    
    public void removeItem(OrderItem item) {
        orderItems.remove(item);
        calculateTotal();
    }
}



