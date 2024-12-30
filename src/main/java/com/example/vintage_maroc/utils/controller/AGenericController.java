package com.example.vintage_maroc.utils.controller;

import lombok.RequiredArgsConstructor;
import com.example.vintage_maroc.utils.api.success.SuccessDTO;
import com.example.vintage_maroc.utils.groups.OnCreate;
import com.example.vintage_maroc.utils.groups.OnUpdate;
import com.example.vintage_maroc.utils.service.IGenericService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
public abstract class AGenericController<T, ID, REQ, RES> {

    protected final IGenericService<T, ID, REQ, RES> service;

    @GetMapping
    public ResponseEntity<SuccessDTO<Page<RES>>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection
    ) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<RES> entities = service.findAll(pageable);
        return ResponseEntity.ok(
                new SuccessDTO<>(
                        HttpStatus.OK.value(),
                        "Entities retrieved successfully",
                        entities
                )
        );
    }

    @GetMapping("/all")
    public ResponseEntity<SuccessDTO<List<RES>>> findAll() {
        List<RES> entities = service.findAll();
        return ResponseEntity.ok(
                new SuccessDTO<>(
                        HttpStatus.OK.value(),
                        "All entities retrieved successfully",
                        entities
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuccessDTO<RES>> findById(@PathVariable ID id) {
        RES entity = service.findByIdAndMapToResponse(id);
        return ResponseEntity.ok(
                new SuccessDTO<>(
                        HttpStatus.OK.value(),
                        "Entity retrieved successfully",
                        entity
                )
        );
    }

    @PostMapping
    public ResponseEntity<SuccessDTO<RES>> create(@Validated({OnCreate.class}) @RequestBody REQ requestDTO) {
        T createdEntity = service.create(requestDTO);
        RES responseDTO = service.getMapper().toResponseDTO(createdEntity);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new SuccessDTO<>(
                        HttpStatus.CREATED.value(),
                        "Entity created successfully",
                        responseDTO
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuccessDTO<RES>> update(@Validated({OnUpdate.class}) @PathVariable ID id, @RequestBody REQ requestDTO) {
        T updatedEntity = service.update(id, requestDTO);
        RES responseDTO = service.getMapper().toResponseDTO(updatedEntity);
        return ResponseEntity.ok(
                new SuccessDTO<>(
                        HttpStatus.OK.value(),
                        "Entity updated successfully",
                        responseDTO
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SuccessDTO<Void>> delete(@PathVariable ID id) {
        service.delete(id);
        return ResponseEntity.ok(
                new SuccessDTO<>(
                        HttpStatus.OK.value(),
                        "Entity deleted successfully",
                        null
                )
        );
    }
}

