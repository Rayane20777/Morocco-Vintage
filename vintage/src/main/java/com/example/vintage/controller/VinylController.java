package com.example.vintage.controller;

import com.example.vintage.dto.request.VinylRequestDTO;
import com.example.vintage.dto.response.VinylResponseDTO;
import com.example.vintage.service.Interface.VinylService;
import com.example.vintage.service.GridFsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class VinylController {

    private final VinylService vinylService;
    private final GridFsService gridFsService;

    // Public endpoints
    @GetMapping("/api/vinyls")
    public ResponseEntity<List<VinylResponseDTO>> getAllVinyls() {
        List<VinylResponseDTO> vinyls = vinylService.getAllVinyls();
        return ResponseEntity.ok(vinyls);
    }

    @GetMapping("/api/vinyls/{id}")
    public ResponseEntity<VinylResponseDTO> getVinylById(@PathVariable String id) {
        VinylResponseDTO vinyl = vinylService.getVinylById(id);
        return ResponseEntity.ok(vinyl);
    }

    @GetMapping("/api/vinyls/{id}/image")
    public ResponseEntity<byte[]> getVinylImage(@PathVariable String id) {
        VinylResponseDTO vinyl = vinylService.getVinylById(id);
        if (vinyl.getImage() == null) {
            return ResponseEntity.notFound().build();
        }
        byte[] imageBytes = gridFsService.getFileContent(vinyl.getImage());
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(imageBytes);
    }

    // Admin endpoints
    @PostMapping("/api/admin/vinyls")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VinylResponseDTO> createVinyl(@ModelAttribute VinylRequestDTO dto) {
        VinylResponseDTO createdVinyl = vinylService.createVinyl(dto);
        return new ResponseEntity<>(createdVinyl, HttpStatus.CREATED);
    }

    @PutMapping("/api/admin/vinyls/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VinylResponseDTO> updateVinyl(@PathVariable String id, @ModelAttribute VinylRequestDTO dto) {
        VinylResponseDTO updatedVinyl = vinylService.updateVinyl(id, dto);
        return ResponseEntity.ok(updatedVinyl);
    }

    @DeleteMapping("/api/admin/vinyls/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVinyl(@PathVariable String id) {
        vinylService.deleteVinyl(id);
        return ResponseEntity.noContent().build();
    }
} 