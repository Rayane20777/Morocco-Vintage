package com.example.vintage.service.Implementation;

import com.example.vintage.model.Shipping;
import com.example.vintage.model.enums.ShippingStatus;
import com.example.vintage.repository.ShippingRepository;
import com.example.vintage.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShippingServiceImpl {
    private final ShippingRepository shippingRepository;
    private final NotificationService notificationService;

    public Shipping createShipping(String address, String city, String postalCode) {
        Shipping shipping = new Shipping();
        shipping.setAddress(address);
        shipping.setCity(city);
        shipping.setPostalCode(postalCode);
        shipping.setStatus(ShippingStatus.PENDING);
        shipping.setTrackingNumber(generateTrackingNumber());
        return shippingRepository.save(shipping);
    }

    public Shipping updateShippingStatus(String shippingId, ShippingStatus status) {
        Shipping shipping = shippingRepository.findById(shippingId)
                .orElseThrow(() -> new RuntimeException("Shipping not found"));
        shipping.setStatus(status);
        return shippingRepository.save(shipping);
    }

    public Shipping trackShipping(String trackingNumber) {
        return shippingRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Shipping not found"));
    }

    private String generateTrackingNumber() {
        // Implementation for generating unique tracking number
        return "TRK" + System.currentTimeMillis();
    }
} 