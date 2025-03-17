package com.example.vintage.mapper;

import com.example.vintage.dto.request.OrderRequest;
import com.example.vintage.dto.response.OrderResponse;
import com.example.vintage.model.Order;
import com.example.vintage.model.OrderItem;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ShippingMapper.class})
public interface OrderMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderDate", expression = "java(new java.util.Date())")
    @Mapping(target = "orderStatus", constant = "PENDING")
    @Mapping(target = "totalAmount", expression = "java(java.math.BigDecimal.ZERO)")
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "shipping", ignore = true)
    Order toEntity(OrderRequest request);

    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "clientName", expression = "java(order.getClient().getFirstName() + \" \" + order.getClient().getLastName())")
    @Mapping(target = "items", source = "orderItems")
    OrderResponse toResponse(Order order);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    OrderResponse.OrderItemResponse toOrderItemResponse(OrderItem orderItem);

    List<OrderResponse.OrderItemResponse> toOrderItemResponseList(List<OrderItem> orderItems);
} 