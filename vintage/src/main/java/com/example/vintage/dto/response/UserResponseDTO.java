package com.example.vintage.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class UserResponseDTO {
    private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Boolean active = true;
    private List<String> roles;
    private String imageId;
}
