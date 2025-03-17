package com.example.vintage.controller;

import com.example.vintage.dto.request.MusicEquipmentRequestDTO;
import com.example.vintage.dto.response.MusicEquipmentResponseDTO;
import com.example.vintage.service.Interface.MusicEquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/music-equipment")
@RequiredArgsConstructor
public class MusicEquipmentController {

    private final MusicEquipmentService musicEquipmentService;

    @PostMapping
    public ResponseEntity<MusicEquipmentResponseDTO> createMusicEquipment(@Valid @ModelAttribute MusicEquipmentRequestDTO dto) {
        MusicEquipmentResponseDTO createdEquipment = musicEquipmentService.createMusicEquipment(dto);
        return new ResponseEntity<>(createdEquipment, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MusicEquipmentResponseDTO> updateMusicEquipment(
            @PathVariable String id, 
            @Valid @ModelAttribute MusicEquipmentRequestDTO dto) {
        MusicEquipmentResponseDTO updatedEquipment = musicEquipmentService.updateMusicEquipment(id, dto);
        return ResponseEntity.ok(updatedEquipment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMusicEquipment(@PathVariable String id) {
        musicEquipmentService.deleteMusicEquipment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MusicEquipmentResponseDTO> getMusicEquipmentById(@PathVariable String id) {
        MusicEquipmentResponseDTO equipment = musicEquipmentService.getMusicEquipmentById(id);
        return ResponseEntity.ok(equipment);
    }

    @GetMapping
    public ResponseEntity<List<MusicEquipmentResponseDTO>> getAllMusicEquipment() {
        List<MusicEquipmentResponseDTO> equipment = musicEquipmentService.getAllMusicEquipment();
        return ResponseEntity.ok(equipment);
    }
} 