package com.example.vintage.repository;

import com.example.vintage.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    long countByDateAddedBetween(Date startDate, Date endDate);
}
