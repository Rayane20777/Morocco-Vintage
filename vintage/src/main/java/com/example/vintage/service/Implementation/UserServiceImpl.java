package com.example.vintage.service.Implementation;

import com.example.vintage.dto.request.UserRequestDTO;
import com.example.vintage.dto.response.UserResponseDTO;
import com.example.vintage.dto.update.UserUpdateDTO;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

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

        // Handle roles
        List<Role> roles = new ArrayList<>();
        
        // Always add USER role
        Role userRole = roleRepository.findByName("USER");
        if (userRole != null) {
            roles.add(userRole);
        } else {
            // If USER role doesn't exist, create it
            userRole = new Role();
            userRole.setName("USER");
            userRole = roleRepository.save(userRole);
            roles.add(userRole);
        }

        // Add any additional roles if provided
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            userDTO.getRoles().stream()
                    .filter(roleName -> !roleName.equals("USER")) // Skip USER as it's already added
                    .map(roleRepository::findByName)
                    .filter(role -> role != null)
                    .forEach(roles::add);
        }

        user.setRoles(roles);
        return userMapper.toDTO(userRepository.save(user));
    }

    @Override
    public UserResponseDTO updateUser(String id, UserUpdateDTO userUpdateDTO) {
        logger.info("Updating user with ID: {}", id);
        logger.info("Update DTO: {}", userUpdateDTO);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        logger.info("Found existing user: {}", user);

        // Check username uniqueness if username is being updated
        if (userUpdateDTO.getUsername() != null && !userUpdateDTO.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(userUpdateDTO.getUsername())) {
                throw new UsernameAlreadyExistsException("Username already exists: " + userUpdateDTO.getUsername());
            }
            user.setUsername(userUpdateDTO.getUsername());
            logger.info("Updated username to: {}", userUpdateDTO.getUsername());
        }

        // Update basic information
        if (userUpdateDTO.getFirstName() != null) {
            user.setFirstName(userUpdateDTO.getFirstName());
            logger.info("Updated firstName to: {}", userUpdateDTO.getFirstName());
        }
        if (userUpdateDTO.getLastName() != null) {
            user.setLastName(userUpdateDTO.getLastName());
            logger.info("Updated lastName to: {}", userUpdateDTO.getLastName());
        }
        if (userUpdateDTO.getEmail() != null) {
            user.setEmail(userUpdateDTO.getEmail());
            logger.info("Updated email to: {}", userUpdateDTO.getEmail());
        }
        if (userUpdateDTO.getPhoneNumber() != null) {
            user.setPhoneNumber(userUpdateDTO.getPhoneNumber());
            logger.info("Updated phoneNumber to: {}", userUpdateDTO.getPhoneNumber());
        }
        if (userUpdateDTO.getActive() != null) {
            user.setActive(userUpdateDTO.getActive());
            logger.info("Updated active status to: {}", userUpdateDTO.getActive());
        }

        // Update roles if provided
        if (userUpdateDTO.getRoles() != null && !userUpdateDTO.getRoles().isEmpty()) {
            List<Role> updatedRoles = userUpdateDTO.getRoles().stream()
                    .map(roleRepository::findByName)
                    .collect(Collectors.toList());
            user.setRoles(updatedRoles);
            logger.info("Updated roles to: {}", userUpdateDTO.getRoles());
        }

        // Handle image upload if provided
        if (userUpdateDTO.getImage() != null && !userUpdateDTO.getImage().isEmpty()) {
            // Delete old image if it exists
            if (user.getImageId() != null) {
                gridFsService.deleteFile(user.getImageId());
                logger.info("Deleted old image with ID: {}", user.getImageId());
            }
            // Save new image
            String imageId = gridFsService.saveFile(userUpdateDTO.getImage());
            user.setImageId(imageId);
            logger.info("Saved new image with ID: {}", imageId);
        }

        User savedUser = userRepository.save(user);
        logger.info("Saved updated user: {}", savedUser);

        UserResponseDTO responseDTO = userMapper.toDTO(savedUser);
        logger.info("Returning response DTO: {}", responseDTO);

        return responseDTO;
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

    @Override
    public String getProfileImageId(String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return user.getImageId(); // Returns the GridFS image ID
    }
}
