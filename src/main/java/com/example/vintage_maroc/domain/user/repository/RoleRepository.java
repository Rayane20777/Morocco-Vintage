package com.example.vintage_maroc.domain.user.repository;

import com.example.vintage_maroc.domain.user.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByName(String name);
}

