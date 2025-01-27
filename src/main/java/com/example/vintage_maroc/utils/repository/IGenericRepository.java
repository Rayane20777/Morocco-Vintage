package com.example.vintage_maroc.utils.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface IGenericRepository<T, ID> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {
    
    // Basic CRUD operations are inherited from JpaRepository:
    // save(T entity)
    // saveAll(Iterable<T> entities)
    // findById(ID id)
    // existsById(ID id)
    // findAll()
    // findAllById(Iterable<ID> ids)
    // count()
    // deleteById(ID id)
    // delete(T entity)
    // deleteAllById(Iterable<ID> ids)
    // deleteAll(Iterable<T> entities)
    // deleteAll()
    
    // Additional common methods
    Optional<T> findByIdAndDeletedFalse(ID id);
    
    List<T> findAllByDeletedFalse();
    
    Page<T> findAllByDeletedFalse(Pageable pageable);
    
    boolean existsByIdAndDeletedFalse(ID id);
    
    // Soft delete methods
    default void softDelete(T entity) {
        if (entity instanceof SoftDeletable softDeletable) {
            softDeletable.setDeleted(true);
            save(entity);
        }
    }
    
    default void softDeleteById(ID id) {
        findById(id).ifPresent(this::softDelete);
    }
    
    // Restore methods
    default void restore(T entity) {
        if (entity instanceof SoftDeletable softDeletable) {
            softDeletable.setDeleted(false);
            save(entity);
        }
    }
    
    default void restoreById(ID id) {
        findById(id).ifPresent(this::restore);
    }
}

