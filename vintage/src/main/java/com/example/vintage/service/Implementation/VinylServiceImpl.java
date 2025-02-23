package com.example.vintage.service.Implementation;

import com.example.vintage.dto.request.VinylRequestDTO;
import com.example.vintage.dto.response.VinylResponseDTO;
import com.example.vintage.entity.Vinyl;
import com.example.vintage.mapper.VinylMapper;
import com.example.vintage.repository.VinylRepository;
import com.example.vintage.service.Interface.VinylService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class VinylServiceImpl implements VinylService {

    private final VinylRepository vinylRepository;
    private final VinylMapper vinylMapper;

    @Override
    public VinylResponseDTO createVinyl(VinylRequestDTO dto) {
        Vinyl vinyl = vinylMapper.toEntity(dto);
        // Convert MultipartFile to byte[]
        if (dto.getImage() != null) {
            try {
                vinyl.setImage(dto.getImage().getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Failed to convert image to byte array", e);
            }
        }
        Vinyl savedVinyl = vinylRepository.save(vinyl);
        return vinylMapper.toResponseDTO(savedVinyl);
    }

    @Override
    public VinylResponseDTO updateVinyl(String id, VinylRequestDTO dto) {
        Vinyl vinyl = vinylRepository.findById(id).orElseThrow(() -> new RuntimeException("Vinyl not found"));
        // Update properties from dto to vinyl
        vinyl = vinylMapper.toEntity(dto);
        vinyl.setId(id); // Ensure the ID remains the same
        if (dto.getImage() != null) {
            try {
                vinyl.setImage(dto.getImage().getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Failed to convert image to byte array", e);
            }
        }
        Vinyl updatedVinyl = vinylRepository.save(vinyl);
        return vinylMapper.toResponseDTO(updatedVinyl);
    }

    @Override
    public void deleteVinyl(String id) {
        vinylRepository.deleteById(id);
    }

    @Override
    public VinylResponseDTO getVinylById(String id) {
        Vinyl vinyl = vinylRepository.findById(id).orElseThrow(() -> new RuntimeException("Vinyl not found"));
        return vinylMapper.toResponseDTO(vinyl);
    }

    @Override
    public List<VinylResponseDTO> getAllVinyls() {
        return vinylRepository.findAll().stream()
                .map(vinylMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
} 