package com.example.vintage_maroc.domain.user.repository;

import com.example.vintage_maroc.domain.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByLogin(String login);
    boolean existsByLogin(String login);
    List<User> findByRoles_NameEquals(String roleName);
}

