package com.example.vintage_maroc.domain.user.application.service;

import com.example.vintage_maroc.domain.user.application.dto.AuthenticationResponse;
import com.example.vintage_maroc.domain.user.application.dto.UserDTO;
import com.example.vintage_maroc.domain.user.model.User;
import com.example.vintage_maroc.domain.user.repository.UserRepository;
import com.example.vintage_maroc.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse authenticate(String login, String password) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(login, password)
        );
        User user = userRepository.findByLogin(login)
            .orElseThrow(() -> new RuntimeException("User not found"));
        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
    }

    public AuthenticationResponse register(UserDTO userDTO) {
        if (userRepository.existsByLogin(userDTO.getLogin())) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
            .login(userDTO.getLogin())
            .password(passwordEncoder.encode(userDTO.getPassword()))
            .active(true)
            .build();

        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
    }
}

