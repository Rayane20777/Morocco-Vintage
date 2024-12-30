package com.example.vintage_maroc.utils.service;

import com.example.vintage_maroc.utils.exceptions.ResourceNotFoundException;
import com.example.vintage_maroc.utils.service.helper.IGenericServiceHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.function.Function;

public interface IGenericService<T, ID, REQ, RES> extends IGenericServiceHelper<T, ID, REQ, RES> {

    Logger logger = LoggerFactory.getLogger(IGenericService.class);

    default Page<RES> findAll(Pageable pageable) {
        Page<T> entities = getRepository().findAll(pageable);
        return getMapper().toResponseDTOs(entities);
    }

    default List<RES> findAll() {
        List<T> entities = getRepository().findAll();
        return getMapper().toResponseDTOs(entities);
    }

    default T findById(ID id) {
        return getRepository().findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entity not found with id: " + id));
    }

    default RES findByIdAndMapToResponse(ID id) {
        return getMapper().toResponseDTO(findById(id));
    }

    @Transactional
    default T create(REQ requestDTO) {
        logger.info("Creating entity with data: {}", requestDTO);
        T entity = getMapper().toEntity(requestDTO);
        return getRepository().save(entity);
    }

    @Transactional
    default T update(ID id, REQ dto) {
        logger.info("Updating entity with id: {} and data: {}", id, dto);
        return findAndExecute(id, entity -> {
            getMapper().updateEntity(entity, dto);
            return getRepository().save(entity);
        });
    }

    @Transactional
    default void delete(ID id) {
        logger.info("Deleting entity with id: {}", id);
        findAndExecute(id, entity -> {
            getRepository().delete(entity);
            return null;
        });
    }

    default boolean existsById(ID id) {
        return getRepository().existsById(id);
    }

    default long count() {
        return getRepository().count();
    }

    default <R> R findAndExecute(ID id, Function<T, R> function) {
        T entity = findById(id);
        return function.apply(entity);
    }

    default List<T> findAllByIds(List<ID> ids) {
        return getRepository().findAllById(ids);
    }

    @Transactional
    default void deleteAllByIds(List<ID> ids) {
        ids.forEach(this::delete);
    }
}

