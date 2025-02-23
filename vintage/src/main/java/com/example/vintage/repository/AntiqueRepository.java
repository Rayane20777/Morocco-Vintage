package com.example.vintage.repository;

import com.example.vintage.entity.Antique;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AntiqueRepository extends MongoRepository<Antique, Long> {
    List<Antique> findByDesigner(String designer);
    List<Antique> findByOrigin(String origin);
} 