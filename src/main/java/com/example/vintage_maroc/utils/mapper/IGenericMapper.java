package com.example.vintage_maroc.utils.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IGenericMapper<T, REQ, RES> {

    T toEntity(REQ req);
    RES toResponseDTO(T entity);
    List<RES> toResponseDTOs(List<T> entities);
    Page<RES> toResponseDTOs(Page<T> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(T entity, @MappingTarget REQ dto);
}

