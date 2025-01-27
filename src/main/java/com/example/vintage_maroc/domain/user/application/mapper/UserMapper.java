package com.example.vintage_maroc.domain.user.application.mapper;

import com.example.vintage_maroc.domain.user.application.dto.UserRequestDTO;
import com.example.vintage_maroc.domain.user.application.dto.UserResponseDTO;
import com.example.vintage_maroc.domain.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "roles", ignore = true)
    UserResponseDTO toResponseDTO(User user);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "roles", ignore = true)
    User toEntity(UserRequestDTO userRequestDTO);
}

