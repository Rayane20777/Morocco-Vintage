package com.example.vintage.service.Implementation;

import com.example.vintage.exception.ResourceNotFoundException;
import com.example.vintage.model.Vinyl;
import com.example.vintage.repository.VinylRepository;
import com.example.vintage.dto.request.VinylRequestDTO;
import com.example.vintage.dto.response.VinylResponseDTO;
import com.example.vintage.service.Interface.VinylService;
import com.example.vintage.mapper.VinylMapper;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VinylServiceImpl implements VinylService {
    private final VinylRepository vinylRepository;
    private final VinylMapper vinylMapper;

    @Override
    public VinylResponseDTO createVinyl(VinylRequestDTO dto) {
        Vinyl vinyl = vinylMapper.toEntity(dto);
        Vinyl savedVinyl = vinylRepository.save(vinyl);
        return vinylMapper.toDto(savedVinyl);
    }

    @Override
    public List<VinylResponseDTO> getAllVinyls() {
        return vinylRepository.findAll()
                .stream()
                .map(vinylMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public VinylResponseDTO getVinylById(String id) {
        return vinylRepository.findById(id)
                .map(vinylMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Vinyl not found with id: " + id));
    }

    @Override
    public VinylResponseDTO updateVinyl(String id, VinylRequestDTO dto) {
        Vinyl existingVinyl = vinylRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vinyl not found with id: " + id));

        vinylMapper.updateVinylFromDto(dto, existingVinyl);
        Vinyl updatedVinyl = vinylRepository.save(existingVinyl);
        return vinylMapper.toDto(updatedVinyl);
    }

    @Override
    public void deleteVinyl(String id) {
        if (!vinylRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vinyl not found with id: " + id);
        }
        vinylRepository.deleteById(id);
    }

    @Override
    public List<VinylResponseDTO> getVinylsByGenre(String genre) {
        return vinylRepository.findByGenresContaining(genre)
                .stream()
                .map(vinylMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<VinylResponseDTO> getVinylsByStyle(String style) {
        return vinylRepository.findByStylesContaining(style)
                .stream()
                .map(vinylMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public VinylResponseDTO getVinylByDiscogsId(Long discogsId) {
        return vinylRepository.findByDiscogsId(discogsId)
                .map(vinylMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Vinyl not found with discogsId: " + discogsId));
    }
} 