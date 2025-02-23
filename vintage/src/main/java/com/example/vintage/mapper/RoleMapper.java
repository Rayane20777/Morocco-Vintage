package com.example.vintage.mapper;

import com.example.vintage.dto.RoleDTO;
import com.example.vintage.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDTO toDTO(Role role);

    Role toEntity(RoleDTO roleDTO);
}
