package com.example.vintage.dto.response;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
public class AuthResponse {
    private String token;
    private String username;
    private Collection<? extends GrantedAuthority> roles;

    public AuthResponse(String token, String username, Collection<? extends GrantedAuthority> roles) {
        this.token = token;
        this.username = username;
        this.roles = roles;
    }
}