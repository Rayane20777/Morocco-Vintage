package com.example.vintage.repository;

import com.example.vintage.model.Shipping;
import com.example.vintage.model.enums.ShippingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShippingRepository extends MongoRepository<Shipping, String> {
    Optional<Shipping> findByTrackingNumber(String trackingNumber);
    List<Shipping> findByStatus(ShippingStatus status);
    boolean existsByTrackingNumber(String trackingNumber);
    long countByStatus(ShippingStatus status);
} 