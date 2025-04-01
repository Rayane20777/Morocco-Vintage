package com.example.vintage.service.Implementation;

import com.example.vintage.dto.ChartData;
import com.example.vintage.dto.DashboardMetrics;
import com.example.vintage.dto.request.OrderRequest;
import com.example.vintage.dto.response.OrderResponse;
import com.example.vintage.exception.OrderNotFoundException;
import com.example.vintage.exception.ResourceNotFoundException;
import com.example.vintage.mapper.OrderMapper;
import com.example.vintage.model.*;
import com.example.vintage.model.enums.OrderStatus;
import com.example.vintage.model.enums.PaymentType;
import com.example.vintage.model.enums.ProductStatus;
import com.example.vintage.repository.*;
import com.example.vintage.service.Interface.OrderService;
import com.example.vintage.service.NotificationService;
import com.example.vintage.mapper.ShippingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;


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
        User client = userRepository.findByUsername(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with username: " + request.getClientId()));
        
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
            
            // Get the price from product
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
    public OrderResponse getOrderById(String orderId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        // Verify that the order belongs to the user
        if (!order.getClient().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }

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
        
        // If the order is being accepted, update product status to SOLD
        if (status == OrderStatus.ACCEPTED) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setStatus(ProductStatus.SOLD);
                
                // Update the product in its respective repository
                if (product instanceof Vinyl) {
                    vinylRepository.save((Vinyl) product);
                } else if (product instanceof Antique) {
                    antiqueRepository.save((Antique) product);
                } else if (product instanceof MusicEquipment) {
                    musicEquipmentRepository.save((MusicEquipment) product);
                }
            }
        }
        
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

    @Override
    public DashboardMetrics getDashboardMetrics() {
        List<Order> allOrders = orderRepository.findAll();
        
        // Calculate total revenue
        double totalRevenue = allOrders.stream()
            .mapToDouble(order -> order.getTotalAmount().doubleValue())
            .sum();
            
        // Get total orders count
        long totalOrders = allOrders.size();
        
        // Get total customers count (all users)
        long totalCustomers = userRepository.count();
        
        // Calculate percentage changes (comparing with previous month)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastMonth = now.minusMonths(1);
        LocalDateTime twoMonthsAgo = now.minusMonths(2);
        
        // Calculate revenue changes
        double lastMonthRevenue = allOrders.stream()
            .filter(order -> order.getOrderDate().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime().isAfter(lastMonth))
            .mapToDouble(order -> order.getTotalAmount().doubleValue())
            .sum();
            
        double revenueChange = lastMonthRevenue > 0 
            ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
            : 0;
            
        // Calculate order changes
        long lastMonthOrders = allOrders.stream()
            .filter(order -> order.getOrderDate().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime().isAfter(lastMonth))
            .count();
            
        double ordersChange = lastMonthOrders > 0 
            ? ((double)(totalOrders - lastMonthOrders) / lastMonthOrders) * 100 
            : 0;

        // Calculate customer changes
        Date lastMonthStart = Date.from(lastMonth.atZone(ZoneId.systemDefault()).toInstant());
        Date lastMonthEnd = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
        Date twoMonthsAgoStart = Date.from(twoMonthsAgo.atZone(ZoneId.systemDefault()).toInstant());
        
        long lastMonthCustomers = userRepository.countByDateAddedBetween(lastMonthStart, lastMonthEnd);
        long previousMonthCustomers = userRepository.countByDateAddedBetween(twoMonthsAgoStart, lastMonthStart);
        
        double customersChange = previousMonthCustomers > 0 
            ? ((double)(lastMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100 
            : 0;
            
        return DashboardMetrics.builder()
            .totalRevenue(totalRevenue)
            .totalOrders(totalOrders)
            .totalCustomers(totalCustomers)
            .revenueChange(revenueChange)
            .ordersChange(ordersChange)
            .customersChange(customersChange)
            .build();
    }

    @Override
    public ChartData getChartData(String period) {
        LocalDateTime now = LocalDateTime.now();
        Date startDate;
        Date endDate = new Date();
        
        switch (period.toLowerCase()) {
            case "weekly":
                startDate = Date.from(now.minusWeeks(1).atZone(ZoneId.systemDefault()).toInstant());
                break;
            case "monthly":
                startDate = Date.from(now.minusMonths(1).atZone(ZoneId.systemDefault()).toInstant());
                break;
            case "yearly":
                startDate = Date.from(now.minusYears(1).atZone(ZoneId.systemDefault()).toInstant());
                break;
            default:
                startDate = Date.from(now.minusWeeks(1).atZone(ZoneId.systemDefault()).toInstant());
        }

        List<Order> orders = orderRepository.findByOrderDateBetween(startDate, endDate);

        // Generate labels based on period
        List<String> labels = generateLabels(period);
        
        // Calculate sales data
        List<Double> salesData = calculateSalesData(orders, period);
        
        // Calculate user data (new users per period)
        List<Integer> userData = calculateUserData(period);

        return ChartData.builder()
            .labels(labels)
            .salesData(salesData)
            .userData(userData)
            .build();
    }

    private List<String> generateLabels(String period) {
        List<String> labels = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        switch (period.toLowerCase()) {
            case "weekly":
                for (int i = 6; i >= 0; i--) {
                    labels.add(now.minusDays(i).format(DateTimeFormatter.ofPattern("EEE")));
                }
                break;
            case "monthly":
                for (int i = 29; i >= 0; i -= 5) {
                    labels.add(now.minusDays(i).format(DateTimeFormatter.ofPattern("MMM dd")));
                }
                break;
            case "yearly":
                for (int i = 11; i >= 0; i--) {
                    labels.add(now.minusMonths(i).format(DateTimeFormatter.ofPattern("MMM")));
                }
                break;
        }
        
        return labels;
    }

    private List<Double> calculateSalesData(List<Order> orders, String period) {
        List<Double> salesData = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        switch (period.toLowerCase()) {
            case "weekly":
                for (int i = 6; i >= 0; i--) {
                    LocalDateTime dayStart = now.minusDays(i).withHour(0).withMinute(0).withSecond(0);
                    LocalDateTime dayEnd = dayStart.plusDays(1);
                    double dailySales = orders.stream()
                        .filter(order -> {
                            LocalDateTime orderDate = order.getOrderDate().toInstant()
                                .atZone(ZoneId.systemDefault())
                                .toLocalDateTime();
                            return orderDate.isAfter(dayStart) && orderDate.isBefore(dayEnd);
                        })
                        .mapToDouble(order -> order.getTotalAmount().doubleValue())
                        .sum();
                    salesData.add(dailySales);
                }
                break;
            case "monthly":
                for (int i = 29; i >= 0; i -= 5) {
                    LocalDateTime periodStart = now.minusDays(i).withHour(0).withMinute(0).withSecond(0);
                    LocalDateTime periodEnd = periodStart.plusDays(5);
                    double periodSales = orders.stream()
                        .filter(order -> {
                            LocalDateTime orderDate = order.getOrderDate().toInstant()
                                .atZone(ZoneId.systemDefault())
                                .toLocalDateTime();
                            return orderDate.isAfter(periodStart) && orderDate.isBefore(periodEnd);
                        })
                        .mapToDouble(order -> order.getTotalAmount().doubleValue())
                        .sum();
                    salesData.add(periodSales);
                }
                break;
            case "yearly":
                for (int i = 11; i >= 0; i--) {
                    LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
                    LocalDateTime monthEnd = monthStart.plusMonths(1);
                    double monthlySales = orders.stream()
                        .filter(order -> {
                            LocalDateTime orderDate = order.getOrderDate().toInstant()
                                .atZone(ZoneId.systemDefault())
                                .toLocalDateTime();
                            return orderDate.isAfter(monthStart) && orderDate.isBefore(monthEnd);
                        })
                        .mapToDouble(order -> order.getTotalAmount().doubleValue())
                        .sum();
                    salesData.add(monthlySales);
                }
                break;
        }
        
        return salesData;
    }

    private List<Integer> calculateUserData(String period) {
        LocalDateTime now = LocalDateTime.now();
        List<Integer> userData = new ArrayList<>();
        
        switch (period.toLowerCase()) {
            case "weekly":
                for (int i = 6; i >= 0; i--) {
                    LocalDateTime startOfDay = now.minusDays(i).withHour(0).withMinute(0).withSecond(0);
                    LocalDateTime endOfDay = startOfDay.plusDays(1);
                    
                    Date startDate = Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
                    Date endDate = Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());
                    
                    long newUsers = userRepository.countByDateAddedBetween(startDate, endDate);
                    userData.add((int) newUsers);
                }
                break;
                
            case "monthly":
                for (int i = 29; i >= 0; i--) {
                    LocalDateTime startOfDay = now.minusDays(i).withHour(0).withMinute(0).withSecond(0);
                    LocalDateTime endOfDay = startOfDay.plusDays(1);
                    
                    Date startDate = Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
                    Date endDate = Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());
                    
                    long newUsers = userRepository.countByDateAddedBetween(startDate, endDate);
                    userData.add((int) newUsers);
                }
                break;
                
            case "yearly":
                for (int i = 11; i >= 0; i--) {
                    LocalDateTime startOfMonth = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
                    LocalDateTime endOfMonth = startOfMonth.plusMonths(1);
                    
                    Date startDate = Date.from(startOfMonth.atZone(ZoneId.systemDefault()).toInstant());
                    Date endDate = Date.from(endOfMonth.atZone(ZoneId.systemDefault()).toInstant());
                    
                    long newUsers = userRepository.countByDateAddedBetween(startDate, endDate);
                    userData.add((int) newUsers);
                }
                break;
        }
        
        return userData;
    }

    @Override
    public List<OrderResponse> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        List<Order> orders = orderRepository.findByClient(user);
        if (orders.isEmpty()) {
            return new ArrayList<>();
        }

        return orders.stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }
} 