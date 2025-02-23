package com.example.vintage.service.Interface;

import com.example.vintage.dto.request.UserRequestDTO;
import com.example.vintage.dto.response.UserResponseDTO;

public interface AuthService {
    UserResponseDTO login(UserRequestDTO Authrequest);
    UserResponseDTO register(UserRequestDTO Authrequest);
}
