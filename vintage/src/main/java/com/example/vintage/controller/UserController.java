package com.example.vintage.controller;

import com.example.vintage.dto.response.UserResponseDTO;
import com.example.vintage.dto.update.UserUpdateDTO;
import com.example.vintage.model.User;
import com.example.vintage.service.Interface.UserService;
import com.example.vintage.service.GridFsService;
import com.example.vintage.mapper.UserMapper;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@AllArgsConstructor
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final GridFsService gridFsService;
    private final UserMapper userMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable String id,
            @ModelAttribute UserUpdateDTO userUpdateDTO) {
        logger.info("Received update request for user with ID: {}", id);
        logger.info("Update DTO: {}", userUpdateDTO);
        UserResponseDTO updatedUser = userService.updateUser(id, userUpdateDTO);
        logger.info("User updated successfully: {}", updatedUser);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserRoles(@PathVariable String id, @RequestBody List<String> roles) {
        userService.updateUserRoles(id, roles);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}/profile-image")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponseDTO> updateProfileImage(
            @PathVariable String id,
            @RequestParam("image") MultipartFile image) {
        return ResponseEntity.ok(userService.updateProfileImage(id, image));
    }

    @GetMapping("/{id}/profile-image")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable String id) {
        String imageId = userService.getProfileImageId(id);
        if (imageId == null) {
            return ResponseEntity.notFound().build();
        }
        byte[] imageBytes = gridFsService.getFileContent(imageId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(imageBytes);
    }

    // New endpoint for users to update their own profile
    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserResponseDTO> updateOwnProfile(@ModelAttribute UserUpdateDTO userUpdateDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.loadUserByUsername(username);
        
        logger.info("User {} updating their own profile", username);
        UserResponseDTO updatedUser = userService.updateUser(user.getId(), userUpdateDTO);
        logger.info("Profile updated successfully: {}", updatedUser);
        return ResponseEntity.ok(updatedUser);
    }

    // New endpoint for users to get their own profile
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserResponseDTO> getOwnProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.loadUserByUsername(username);
        
        return ResponseEntity.ok(userMapper.toDTO(user));
    }
}
