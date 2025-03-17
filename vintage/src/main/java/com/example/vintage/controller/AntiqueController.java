package com.example.vintage.controller;

import com.example.vintage.dto.request.AntiqueRequestDTO;
import com.example.vintage.dto.response.AntiqueResponseDTO;
import com.example.vintage.service.Interface.AntiqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AntiqueController {

    private final AntiqueService antiqueService;

    // Public endpoints
    @GetMapping("/api/antiques")
    public ResponseEntity<List<AntiqueResponseDTO>> getAllAntiques() {
        return ResponseEntity.ok(antiqueService.getAllAntiques());
    }

    @GetMapping("/api/antiques/{id}")
    public ResponseEntity<AntiqueResponseDTO> getAntiqueById(@PathVariable String id) {
        return ResponseEntity.ok(antiqueService.getAntiqueById(id));
    }

    // Admin endpoints
    @PostMapping("/api/admin/antiques")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AntiqueResponseDTO> createAntique(@ModelAttribute AntiqueRequestDTO antiqueRequestDTO) throws IOException {
        return new ResponseEntity<>(antiqueService.createAntique(antiqueRequestDTO), HttpStatus.CREATED);
    }

    @PutMapping("/api/admin/antiques/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AntiqueResponseDTO> updateAntique(
            @PathVariable String id,
            @ModelAttribute AntiqueRequestDTO antiqueRequestDTO) throws IOException {
        return ResponseEntity.ok(antiqueService.updateAntique(id, antiqueRequestDTO));
    }

    @DeleteMapping("/api/admin/antiques/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAntique(@PathVariable String id) {
        antiqueService.deleteAntique(id);
        return ResponseEntity.noContent().build();
    }
} 