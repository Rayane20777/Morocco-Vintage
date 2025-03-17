package com.example.vintage.service.Implementation;

import com.example.vintage.dto.request.OrderRequest;
import com.example.vintage.dto.response.OrderResponse;
import com.example.vintage.exception.OrderNotFoundException;
import com.example.vintage.exception.ResourceNotFoundException;
import com.example.vintage.mapper.OrderMapper;
import com.example.vintage.model.*;
import com.example.vintage.model.enums.OrderStatus;
import com.example.vintage.model.enums.PaymentType;
import com.example.vintage.repository.*;
import com.example.vintage.service.Interface.OrderService;
import com.example.vintage.service.NotificationService;
import com.example.vintage.mapper.ShippingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final VinylRepository vinylRepository;
    private final AntiqueRepository antiqueRepository;
    private final MusicEquipmentRepository musicEquipmentRepository;
    private final OrderMapper orderMapper;
    private final ShippingMapper shippingMapper;
    private final NotificationService notificationService;
    private final ShippingRepository shippingRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + request.getClientId()));
        
        // Create and save shipping information first
        Shipping shipping = shippingMapper.toEntity(request.getShipping());
        shipping = shippingRepository.save(shipping);

        // Create the order with initial values
        Order order = new Order();
        order.setClient(client);
        order.setPaymentType(request.getPaymentType());
        order.setShipping(shipping);
        order.setOrderDate(new Date());
        order.setOrderStatus(OrderStatus.PENDING);
        
        // Save the order first to get an ID
        Order savedOrder = orderRepository.save(order);
        
        // Process each order item
        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            // Find the product
            Product product = findProduct(itemRequest.getProductId());
            if (product == null) {
                throw new ResourceNotFoundException("Product not found with id: " + itemRequest.getProductId());
            }
            
            // Create order item with the saved order
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            
            // Get the price from product (now properly converted from string)
            BigDecimal productPrice = product.getPrice();
            if (productPrice.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalStateException("Product price must be greater than zero for product: " + product.getId());
            }
            orderItem.setPrice(productPrice);
            
            // Save the order item
            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            
            // Add to order's items list
            savedOrder.getOrderItems().add(savedOrderItem);
        }
        
        // Calculate total amount and update the order
        savedOrder.calculateTotal();
        savedOrder = orderRepository.save(savedOrder);
        
        // Send notification
        notificationService.notifyOrderStatus(savedOrder);
        
        return orderMapper.toResponse(savedOrder);
    }

    private Product findProduct(String productId) {
        Optional<Vinyl> vinyl = vinylRepository.findById(productId);
        if (vinyl.isPresent()) {
            return vinyl.get();
        }

        Optional<Antique> antique = antiqueRepository.findById(productId);
        if (antique.isPresent()) {
            return antique.get();
        }

        Optional<MusicEquipment> musicEquipment = musicEquipmentRepository.findById(productId);
        if (musicEquipment.isPresent()) {
            return musicEquipment.get();
        }

        return null;
    }

    @Override
    public OrderResponse getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        return orderMapper.toResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByClientId(String clientId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + clientId));
        return orderRepository.findByClient(client).stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByOrderStatus(status).stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        order.setOrderStatus(status);
        Order updatedOrder = orderRepository.save(order);
        notificationService.notifyOrderStatus(updatedOrder);
        return orderMapper.toResponse(updatedOrder);
    }

    @Override
    @Transactional
    public void deleteOrder(String orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new OrderNotFoundException("Order not found with id: " + orderId);
        }
        orderRepository.deleteById(orderId);
    }

    @Override
    @Transactional
    public Order placeOrder(User client, Product product, PaymentType paymentType, Shipping shipping) {
        // Save shipping first
        shipping = shippingRepository.save(shipping);

        // Create and save order
        Order order = new Order();
        order.setClient(client);
        order.setOrderDate(new Date());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentType(paymentType);
        order.setShipping(shipping);
        
        // Save order to get ID
        Order savedOrder = orderRepository.save(order);
        
        // Create and save order item
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(savedOrder);
        orderItem.setProduct(product);
        orderItem.setPrice(product.getPrice());
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
        
        // Add item to order and update
        savedOrder.getOrderItems().add(savedOrderItem);
        savedOrder.calculateTotal();
        savedOrder = orderRepository.save(savedOrder);
        
        notificationService.notifyOrderStatus(savedOrder);
        return savedOrder;
    }

    @Override
    public Order trackOrder(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
    }

    @Override
    public Order acceptOrder(String orderId) {
        Order order = trackOrder(orderId);
        order.setOrderStatus(OrderStatus.ACCEPTED);
        Order updatedOrder = orderRepository.save(order);
        notificationService.notifyOrderStatus(updatedOrder);
        return updatedOrder;
    }

    @Override
    public Order denyOrder(String orderId) {
        Order order = trackOrder(orderId);
        order.setOrderStatus(OrderStatus.DENIED);
        Order updatedOrder = orderRepository.save(order);
        notificationService.notifyOrderStatus(updatedOrder);
        return updatedOrder;
    }

    @Override
    public Order cancelOrder(String orderId) {
        Order order = trackOrder(orderId);
        order.setOrderStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        notificationService.notifyOrderStatus(updatedOrder);
        return updatedOrder;
    }

    @Override
    public Order refundOrder(String orderId) {
        Order order = trackOrder(orderId);
        order.setOrderStatus(OrderStatus.REFUNDED);
        Order updatedOrder = orderRepository.save(order);
        notificationService.notifyOrderStatus(updatedOrder);
        return updatedOrder;
    }
} 