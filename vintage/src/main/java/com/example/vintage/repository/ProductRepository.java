package com.example.vintage.repository;

import com.example.vintage.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByName(String name);
    List<Product> findByYear(int year);
    List<Product> findByStatus(String status);
    List<Product> findByActive(boolean active);
    List<Product> findByType(String type);
} 