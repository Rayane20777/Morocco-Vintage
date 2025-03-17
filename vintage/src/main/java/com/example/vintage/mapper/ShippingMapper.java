package com.example.vintage.mapper;

import com.example.vintage.dto.request.OrderRequest;
import com.example.vintage.dto.response.OrderResponse;
import com.example.vintage.model.Shipping;
import com.example.vintage.model.enums.ShippingStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShippingMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "trackingNumber", expression = "java(generateTrackingNumber())")
    Shipping toEntity(OrderRequest.ShippingRequest request);

    @Mapping(target = "status", source = "status")
    OrderResponse.ShippingResponse toResponse(Shipping shipping);

    default String generateTrackingNumber() {
        return "TRK" + System.currentTimeMillis();
    }
} 