package com.example.vintage.repository;

import com.example.vintage.model.Order;
import com.example.vintage.model.User;
import com.example.vintage.model.enums.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Date;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByClient(User client);
    List<Order> findByOrderStatus(OrderStatus status);
    List<Order> findByClientAndOrderStatus(User client, OrderStatus status);
    List<Order> findByOrderDateBetween(Date startDate, Date endDate);
    List<Order> findByClientAndOrderDateBetween(User client, Date startDate, Date endDate);
    long countByOrderStatus(OrderStatus status);
    boolean existsByClientAndOrderStatus(User client, OrderStatus status);
} 