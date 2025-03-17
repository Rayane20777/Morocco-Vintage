package com.example.vintage.service;

import com.example.vintage.model.Order;
import com.example.vintage.model.enums.OrderStatus;
import com.example.vintage.model.enums.PaymentType;
import com.example.vintage.service.Implementation.OrderServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final OrderServiceImpl orderService;

    public Order processPayment(Order order) {
        // Validate payment type
        if (order.getPaymentType() == PaymentType.CASH_ON_DELIVERY) {
            return processHandByHandPayment(order);
        } else if (order.getPaymentType() == PaymentType.PICK_UP) {
            return processInPlacePayment(order);
        }
        throw new IllegalArgumentException("Unsupported payment type");
    }

    private Order processHandByHandPayment(Order order) {
        // Implementation for hand by hand payment
        order.setOrderStatus(OrderStatus.PENDING);
        return orderService.acceptOrder(order.getId());
    }

    private Order processInPlacePayment(Order order) {
        // Implementation for in-place payment
        order.setOrderStatus(OrderStatus.PENDING);
        return orderService.acceptOrder(order.getId());
    }

    public boolean validatePayment(Order order) {
        // Add payment validation logic here
        return true;
    }
} 