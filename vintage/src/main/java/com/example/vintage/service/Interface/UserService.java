package com.example.vintage.service.Interface;

import com.example.vintage.dto.request.UserRequestDTO;
import com.example.vintage.dto.response.UserResponseDTO;
import com.example.vintage.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    UserResponseDTO register(UserRequestDTO userDTO);
    List<UserResponseDTO> getAllUsers();
    void updateUserRoles(String id, List<String> roles);
    User loadUserByUsername(String username);
    UserResponseDTO updateProfileImage(String userId, MultipartFile image);
    byte[] getProfileImage(String userId);
    String getProfileImageId(String id);
}
