package com.example.vintage.controller;

import com.example.vintage.dto.request.LoginRequest;
import com.example.vintage.dto.request.UserRequestDTO;
import com.example.vintage.dto.response.AuthResponse;
import com.example.vintage.dto.response.UserResponseDTO;
import com.example.vintage.security.JwtTokenProvider;
import com.example.vintage.service.CustomUserDetails;
import com.example.vintage.service.Interface.UserService;
import com.example.vintage.service.TokenBlacklistService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private TokenBlacklistService tokenBlacklistService;




    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        String token = jwtTokenProvider.generateToken(userDetails.getUsername(), roles);

        return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername(), userDetails.getAuthorities()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@ModelAttribute UserRequestDTO userDTO) {
        UserResponseDTO registeredUser = userService.register(userDTO);

        List<String> roles = registeredUser.getRoles();

        String token = jwtTokenProvider.generateToken(registeredUser.getUsername(), roles);

        List<SimpleGrantedAuthority> authorities = registeredUser.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .toList();

        return ResponseEntity.ok(new AuthResponse(token, registeredUser.getUsername(), authorities));
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid or missing Authorization header");
        }
        
        String token = authorization.replace("Bearer ", "");
        tokenBlacklistService.blacklistToken(token);
        
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}