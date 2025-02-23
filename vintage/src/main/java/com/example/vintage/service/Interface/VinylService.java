package com.example.vintage.service.Interface;

import com.example.vintage.dto.request.VinylRequestDTO;
import com.example.vintage.dto.response.VinylResponseDTO;

import java.util.List;

public interface VinylService {
    VinylResponseDTO createVinyl(VinylRequestDTO dto);
    VinylResponseDTO updateVinyl(String id, VinylRequestDTO dto);
    void deleteVinyl(String id);
    VinylResponseDTO getVinylById(String id);
    List<VinylResponseDTO> getAllVinyls();
} 