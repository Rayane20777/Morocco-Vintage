package com.example.vintage.service;

import com.example.vintage.model.Order;
import com.example.vintage.model.Shipping;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final EmailService emailService;

    public void notifyOrderStatus(Order order) {
        try {
            String name = order.getClient().getFirstName();
            String email = order.getClient().getEmail();
            
            switch (order.getOrderStatus()) {
                case PENDING -> emailService.sendOrderConfirmation(
                    email, 
                    name, 
                    order.getId(), 
                    order.getTotalAmount().doubleValue()
                );
                case SHIPPED -> {
                    if (order.getShipping() != null) {
                        emailService.sendShippingUpdate(
                            email,
                            name,
                            order.getId(),
                            order.getShipping().getTrackingNumber(),
                            order.getOrderStatus().toString()
                        );
                    }
                }
                default -> log.info("No notification configured for order status: {}", order.getOrderStatus());
            }
        } catch (Exception e) {
            log.error("Failed to send order notification: {}", e.getMessage());
        }
    }

//    public void notifyShippingUpdate(Shipping shipping) {
//        try {
//            if (shipping.getOrder() != null && shipping.getOrder().getClient() != null) {
//                emailService.sendShippingUpdate(
//                    shipping.getOrder().getClient().getEmail(),
//                    shipping.getOrder().getClient().getFirstName(),
//                    shipping.getOrder().getId(),
//                    shipping.getTrackingNumber(),
//                    shipping.getStatus().toString()
//                );
//            }
//        } catch (Exception e) {
//            log.error("Failed to send shipping notification: {}", e.getMessage());
//        }
//    }
} 