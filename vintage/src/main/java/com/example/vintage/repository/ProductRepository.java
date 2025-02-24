package com.example.vintage.repository;

import com.example.vintage.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.NoRepositoryBean;
import java.math.BigDecimal;
import java.util.List;

@NoRepositoryBean
public interface ProductRepository<T extends Product> extends MongoRepository<T, String> {
    List<T> findByYear(int year);
    List<T> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
} 