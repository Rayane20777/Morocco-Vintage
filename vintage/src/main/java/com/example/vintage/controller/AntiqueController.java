package com.example.vintage.controller;

import com.example.vintage.dto.request.AntiqueRequestDTO;
import com.example.vintage.dto.response.AntiqueResponseDTO;
import com.example.vintage.service.Interface.AntiqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/antiques")
@RequiredArgsConstructor
public class AntiqueController {

    private final AntiqueService antiqueService;

    @PostMapping
    public ResponseEntity<AntiqueResponseDTO> createAntique(@ModelAttribute AntiqueRequestDTO antiqueRequestDTO) throws IOException {
        return new ResponseEntity<>(antiqueService.createAntique(antiqueRequestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AntiqueResponseDTO>> getAllAntiques() {
        return ResponseEntity.ok(antiqueService.getAllAntiques());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AntiqueResponseDTO> getAntiqueById(@PathVariable String id) {
        return ResponseEntity.ok(antiqueService.getAntiqueById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AntiqueResponseDTO> updateAntique(
            @PathVariable String id,
            @ModelAttribute AntiqueRequestDTO antiqueRequestDTO) throws IOException {
        return ResponseEntity.ok(antiqueService.updateAntique(id, antiqueRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAntique(@PathVariable String id) {
        antiqueService.deleteAntique(id);
        return ResponseEntity.noContent().build();
    }
} 