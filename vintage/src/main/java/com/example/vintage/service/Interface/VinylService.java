package com.example.vintage.service.Interface;

import com.example.vintage.dto.request.VinylRequestDTO;
import com.example.vintage.dto.response.VinylResponseDTO;

import java.util.List;

public interface VinylService {
    VinylResponseDTO createVinyl(VinylRequestDTO dto);
    List<VinylResponseDTO> getAllVinyls();
    VinylResponseDTO getVinylById(String id);
    VinylResponseDTO updateVinyl(String id, VinylRequestDTO dto);
    void deleteVinyl(String id);
    List<VinylResponseDTO> getVinylsByGenre(String genre);
    List<VinylResponseDTO> getVinylsByStyle(String style);
    VinylResponseDTO getVinylByDiscogsId(Long discogsId);
} 