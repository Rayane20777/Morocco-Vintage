package com.example.vintage.service.Interface;

import com.example.vintage.dto.request.AntiqueRequestDTO;
import com.example.vintage.dto.response.AntiqueResponseDTO;

import java.io.IOException;
import java.util.List;

public interface AntiqueService {
    List<AntiqueResponseDTO> getAllAntiques();
    AntiqueResponseDTO getAntiqueById(String id);
    AntiqueResponseDTO createAntique(AntiqueRequestDTO antiqueRequestDTO) throws IOException;
    AntiqueResponseDTO updateAntique(String id, AntiqueRequestDTO antiqueRequestDTO) throws IOException;
    void deleteAntique(String id);
} 