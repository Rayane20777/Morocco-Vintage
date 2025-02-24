package com.example.vintage.mapper;

import com.example.vintage.dto.RoleDTO;
import com.example.vintage.model.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDTO toDTO(Role role);

    Role toEntity(RoleDTO roleDTO);
}
