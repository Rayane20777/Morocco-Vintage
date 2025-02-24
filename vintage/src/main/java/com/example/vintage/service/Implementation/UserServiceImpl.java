package com.example.vintage.service.Implementation;

import com.example.vintage.dto.request.UserRequestDTO;
import com.example.vintage.dto.response.UserResponseDTO;
import com.example.vintage.model.Role;
import com.example.vintage.model.User;
import com.example.vintage.exception.ResourceNotFoundException;
import com.example.vintage.exception.UsernameAlreadyExistsException;
import com.example.vintage.mapper.UserMapper;
import com.example.vintage.repository.RoleRepository;
import com.example.vintage.repository.UserRepository;
import com.example.vintage.service.GridFsService;
import com.example.vintage.service.Interface.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private UserMapper userMapper;
    private GridFsService gridFsService;

    @Override
    public UserResponseDTO register(UserRequestDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already exists: " + userDTO.getUsername());
        }

        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Handle image upload
        if (userDTO.getImage() != null && !userDTO.getImage().isEmpty()) {
            String imageId = gridFsService.saveFile(userDTO.getImage());
            user.setImageId(imageId);
        }

        List<Role> roles = userDTO.getRoles().stream()
                .map(roleName -> roleRepository.findByName(roleName))
                .collect(Collectors.toList());

        if (roles.isEmpty()) {
            roles.add(roleRepository.findByName("USER"));
        }

        user.setRoles(roles);

        return userMapper.toDTO(userRepository.save(user));
    }

    // Add a method to update user's profile image
    @Override
    public UserResponseDTO updateProfileImage(String userId, MultipartFile image) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Delete old image if it exists
        if (user.getImageId() != null) {
            gridFsService.deleteFile(user.getImageId());
        }

        // Save new image
        String imageId = gridFsService.saveFile(image);
        user.setImageId(imageId);

        return userMapper.toDTO(userRepository.save(user));
    }

    // Add this method to get user's profile image
    @Override
    public byte[] getProfileImage(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getImageId() == null) {
            throw new ResourceNotFoundException("Profile image not found for user: " + userId);
        }

        return gridFsService.getFileContent(user.getImageId());
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toDTO).toList();
    }

    @Override
    public void updateUserRoles(String id, List<String> roles) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        List<Role> updatedRoles = roles.stream().map(roleRepository::findByName).toList();
        user.setRoles(updatedRoles);
        userRepository.save(user);
    }

    @Override
    public User loadUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}
