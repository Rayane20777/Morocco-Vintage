package com.example.vintage.service;

import com.example.vintage.dto.request.OrderRequest;
import com.example.vintage.dto.response.OrderResponse;

import java.util.List;

interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    OrderResponse getOrderById(String orderId, String username);
    List<OrderResponse> getUserOrders(String username);
    List<OrderResponse> getAllOrders();
    OrderResponse updateOrderStatus(String orderId, String status);
} 