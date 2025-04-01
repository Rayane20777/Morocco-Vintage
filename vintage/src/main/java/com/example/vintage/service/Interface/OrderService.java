package com.example.vintage.service.Interface;

import com.example.vintage.dto.ChartData;
import com.example.vintage.dto.DashboardMetrics;
import com.example.vintage.dto.request.OrderRequest;
import com.example.vintage.dto.response.OrderResponse;
import com.example.vintage.model.Order;
import com.example.vintage.model.Product;
import com.example.vintage.model.Shipping;
import com.example.vintage.model.User;
import com.example.vintage.model.enums.OrderStatus;
import com.example.vintage.model.enums.PaymentType;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    OrderResponse getOrderById(String orderId);
    OrderResponse getOrderById(String orderId, String username);
    List<OrderResponse> getUserOrders(String username);
    List<OrderResponse> getAllOrders();
    List<OrderResponse> getOrdersByClientId(String clientId);
    List<OrderResponse> getOrdersByStatus(OrderStatus status);
    OrderResponse updateOrderStatus(String orderId, OrderStatus status);
    void deleteOrder(String orderId);
    Order placeOrder(User client, Product product, PaymentType paymentType, Shipping shipping);
    Order trackOrder(String orderId);
    Order acceptOrder(String orderId);
    Order denyOrder(String orderId);
    Order cancelOrder(String orderId);
    Order refundOrder(String orderId);
    DashboardMetrics getDashboardMetrics();
    ChartData getChartData(String period);
} 