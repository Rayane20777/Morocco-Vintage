package com.example.vintage.controller;

import com.example.vintage.dto.ChartData;
import com.example.vintage.dto.DashboardMetrics;
import com.example.vintage.dto.request.OrderRequest;
import com.example.vintage.dto.response.OrderResponse;
import com.example.vintage.model.User;
import com.example.vintage.model.enums.OrderStatus;
import com.example.vintage.service.Interface.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class OrderController {
    private final OrderService orderService;

    // User endpoints
    @PostMapping("/user/orders")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        // Get the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Update the request with the authenticated user's ID
        request.setClientId(username);
        
        OrderResponse createdOrder = orderService.createOrder(request);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/user/orders")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<OrderResponse>> getUserOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return ResponseEntity.ok(orderService.getUserOrders(username));
    }

    @GetMapping("/user/orders/{orderId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return ResponseEntity.ok(orderService.getOrderById(orderId, username));
    }

    // Admin endpoints
    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/admin/orders/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> getOrderByIdAdmin(@PathVariable String orderId) {
        OrderResponse order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/admin/orders/client/{clientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getOrdersByClientId(@PathVariable String clientId) {
        List<OrderResponse> orders = orderService.getOrdersByClientId(clientId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/admin/orders/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<OrderResponse> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/admin/orders/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, OrderStatus> request) {
        OrderStatus status = request.get("status");
        OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/admin/orders/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrder(@PathVariable String orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/orders/dashboard/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardMetrics> getDashboardMetrics() {
        return ResponseEntity.ok(orderService.getDashboardMetrics());
    }

    @GetMapping("/admin/orders/dashboard/chart-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChartData> getChartData(@RequestParam(defaultValue = "weekly") String period) {
        return ResponseEntity.ok(orderService.getChartData(period));
    }
} 