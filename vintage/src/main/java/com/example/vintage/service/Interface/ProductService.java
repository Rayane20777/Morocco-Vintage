package com.example.vintage.service.Interface;

import com.example.vintage.model.Product;
import java.util.List;

public interface ProductService<T extends Product> {
    T save(T product);
    T findById(String id);
    List<T> findAll();
    void deleteById(String id);
    // Add other common product methods
} 