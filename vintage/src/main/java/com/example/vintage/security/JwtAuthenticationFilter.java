package com.example.vintage.security;


import com.example.vintage.service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider,
                                   UserDetailsService userDetailsService,
                                   TokenBlacklistService tokenBlacklistService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {
        log.info("Processing request to: {}", request.getRequestURI());
        String token = extractToken(request);
        log.info("Token present: {}", token != null);
        
        // If no token is present and the request is for a public endpoint, continue the chain
        if (token == null && isPublicEndpoint(request.getRequestURI())) {
            chain.doFilter(request, response);
            return;
        }
        
        // Check for blacklisted token
        if (token != null && tokenBlacklistService.isBlacklisted(token)) {
            log.warn("Blocked blacklisted token");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is blacklisted");
            return;
        }
        
        try {
            if (token != null && tokenProvider.validateToken(token)) {
                String username = tokenProvider.getUsernameFromToken(token);
                List<String> roles = tokenProvider.getRolesFromToken(token);

                log.info("Username from token: {}", username);
                log.info("Roles from token: {}", roles);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Ensure roles have ROLE_ prefix
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(role -> {
                            String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                            return new SimpleGrantedAuthority(roleWithPrefix);
                        })
                        .toList();

                log.info("Granted Authorities: {}", authorities);

                var authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("Authentication set in SecurityContext for user: {}", username);
                
                // Continue the filter chain only after successful authentication
                chain.doFilter(request, response);
                return;
            }
            
            // Token is present but invalid
            if (token != null) {
                log.error("Invalid token");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }
            
            // No token present and not a public endpoint
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Full authentication is required to access this resource");
            
        } catch (Exception e) {
            log.error("Authentication failed: {}", e.getMessage(), e);
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed: " + e.getMessage());
        }
    }

    private boolean isPublicEndpoint(String uri) {
        return uri != null && (
            uri.startsWith("/api/vinyls") ||
            uri.startsWith("/api/auth") ||
            uri.startsWith("/api/public") ||
            uri.startsWith("/api/images")
        );
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        log.info("Authorization header: {}", header);

        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
