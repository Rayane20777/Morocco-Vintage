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
    @Mapping(target = "clientName", expression = "java(order.getClient() != null ? (order.getClient().getFirstName() != null ? order.getClient().getFirstName() : \"\") + \" \" + (order.getClient().getLastName() != null ? order.getClient().getLastName() : \"\") : \"\")")
    @Mapping(target = "items", source = "orderItems")
    OrderResponse toResponse(Order order);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "description", source = "product.description")
    @Mapping(target = "price", source = "product.price")
    @Mapping(target = "type", source = "product.type")
    @Mapping(target = "image", source = "product.image")
    @Mapping(target = "year", source = "product.year")
    @Mapping(target = "status", source = "product.status")
    @Mapping(target = "artists", expression = "java(orderItem.getProduct() instanceof com.example.vintage.model.Vinyl ? ((com.example.vintage.model.Vinyl) orderItem.getProduct()).getArtists() : null)")
    @Mapping(target = "genres", expression = "java(orderItem.getProduct() instanceof com.example.vintage.model.Vinyl ? ((com.example.vintage.model.Vinyl) orderItem.getProduct()).getGenres() : null)")
    @Mapping(target = "styles", expression = "java(orderItem.getProduct() instanceof com.example.vintage.model.Vinyl ? ((com.example.vintage.model.Vinyl) orderItem.getProduct()).getStyles() : null)")
    @Mapping(target = "format", expression = "java(orderItem.getProduct() instanceof com.example.vintage.model.Vinyl ? ((com.example.vintage.model.Vinyl) orderItem.getProduct()).getFormat() : null)")
    @Mapping(target = "origin", expression = "java(orderItem.getProduct() instanceof com.example.vintage.model.Antique ? ((com.example.vintage.model.Antique) orderItem.getProduct()).getOrigin() : null)")
    @Mapping(target = "material", expression = "java(orderItem.getProduct() instanceof com.example.vintage.model.Antique ? ((com.example.vintage.model.Antique) orderItem.getProduct()).getMaterial() : null)")
    @Mapping(target = "condition", expression = "java(orderItem.getProduct() instanceof com.example.vintage.model.Antique ? ((com.example.vintage.model.Antique) orderItem.getProduct()).getCondition() : null)")
    @Mapping(target = "model", expression = "java(orderItem.getProduct() instanceof com.example.vintage.model.MusicEquipment ? ((com.example.vintage.model.MusicEquipment) orderItem.getProduct()).getModel() : null)")
    @Mapping(target = "equipmentCondition", expression = "java(orderItem.getProduct() instanceof com.example.vintage.model.MusicEquipment ? ((com.example.vintage.model.MusicEquipment) orderItem.getProduct()).getEquipmentCondition() : null)")
    OrderResponse.OrderItemResponse toOrderItemResponse(OrderItem orderItem);

    List<OrderResponse.OrderItemResponse> toOrderItemResponseList(List<OrderItem> orderItems);
} 