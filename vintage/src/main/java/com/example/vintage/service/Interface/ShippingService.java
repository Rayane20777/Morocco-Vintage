package com.example.vintage.service.Interface;

import com.example.vintage.dto.request.ShippingRequest;
import com.example.vintage.dto.response.ShippingResponse;
import com.example.vintage.model.enums.ShippingStatus;
import java.util.List;

public interface ShippingService {
    ShippingResponse createShipping(ShippingRequest request);
    ShippingResponse updateShippingStatus(String shippingId, ShippingStatus status);
    ShippingResponse getShippingByTrackingNumber(String trackingNumber);
    List<ShippingResponse> getShippingsByStatus(ShippingStatus status);
    void deleteShipping(String shippingId);
    boolean existsByTrackingNumber(String trackingNumber);
    long countByStatus(ShippingStatus status);
} 