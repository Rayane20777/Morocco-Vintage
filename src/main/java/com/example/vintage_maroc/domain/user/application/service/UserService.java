package com.example.vintage_maroc.domain.user.application.service;

import com.example.vintage_maroc.domain.user.application.dto.UserRequestDTO;
import com.example.vintage_maroc.domain.user.application.dto.UserResponseDTO;
import com.example.vintage_maroc.domain.user.application.mapper.UserMapper;
import com.example.vintage_maroc.domain.user.model.Role;
import com.example.vintage_maroc.domain.user.model.User;
import com.example.vintage_maroc.domain.user.repository.RoleRepository;
import com.example.vintage_maroc.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO create(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByLogin(userRequestDTO.getLogin())) {
            throw new RuntimeException("Username already exists");
        }

        User user = userMapper.toEntity(userRequestDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(getRoles(userRequestDTO.getRoles()));

        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    @Transactional
    public UserResponseDTO update(String id, UserRequestDTO userRequestDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setLogin(userRequestDTO.getLogin());
        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }
        existingUser.setRoles(getRoles(userRequestDTO.getRoles()));

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponseDTO(updatedUser);
    }

    @Transactional
    public void delete(String id) {
        userRepository.deleteById(id);
    }

    private Set<Role> getRoles(Set<String> roleNames) {
        return roleNames.stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName)))
                .collect(Collectors.toSet());
    }
}

