package com.example.vintage.controller;

import com.example.vintage.dto.request.MusicEquipmentRequestDTO;
import com.example.vintage.dto.response.MusicEquipmentResponseDTO;
import com.example.vintage.service.Interface.MusicEquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MusicEquipmentController {

    private final MusicEquipmentService musicEquipmentService;

    // Public endpoints
    @GetMapping("/api/music-equipment")
    public ResponseEntity<List<MusicEquipmentResponseDTO>> getAllMusicEquipment() {
        List<MusicEquipmentResponseDTO> equipment = musicEquipmentService.getAllMusicEquipment();
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/api/music-equipment/{id}")
    public ResponseEntity<MusicEquipmentResponseDTO> getMusicEquipmentById(@PathVariable String id) {
        MusicEquipmentResponseDTO equipment = musicEquipmentService.getMusicEquipmentById(id);
        return ResponseEntity.ok(equipment);
    }

    // Admin endpoints
    @PostMapping("/api/admin/music-equipment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MusicEquipmentResponseDTO> createMusicEquipment(@Valid @ModelAttribute MusicEquipmentRequestDTO dto) {
        MusicEquipmentResponseDTO createdEquipment = musicEquipmentService.createMusicEquipment(dto);
        return new ResponseEntity<>(createdEquipment, HttpStatus.CREATED);
    }

    @PutMapping("/api/admin/music-equipment/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MusicEquipmentResponseDTO> updateMusicEquipment(
            @PathVariable String id, 
            @Valid @ModelAttribute MusicEquipmentRequestDTO dto) {
        MusicEquipmentResponseDTO updatedEquipment = musicEquipmentService.updateMusicEquipment(id, dto);
        return ResponseEntity.ok(updatedEquipment);
    }

    @DeleteMapping("/api/admin/music-equipment/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMusicEquipment(@PathVariable String id) {
        musicEquipmentService.deleteMusicEquipment(id);
        return ResponseEntity.noContent().build();
    }
} 