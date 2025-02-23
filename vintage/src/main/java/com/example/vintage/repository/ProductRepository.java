package com.example.vintage.repository;

import com.example.vintage.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByYear(int year);
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
} 