package com.example.vintage.service.Implementation;

import com.example.vintage.dto.request.MusicEquipmentRequestDTO;
import com.example.vintage.dto.response.MusicEquipmentResponseDTO;
import com.example.vintage.exception.ResourceNotFoundException;
import com.example.vintage.mapper.MusicEquipmentMapper;
import com.example.vintage.model.MusicEquipment;
import com.example.vintage.model.Product;
import com.example.vintage.repository.MusicEquipmentRepository;
import com.example.vintage.repository.ProductRepository;
import com.example.vintage.service.GridFsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MusicEquipmentServiceImplTest {

    @Mock
    private MusicEquipmentRepository musicEquipmentRepository;

    @Mock
    private MusicEquipmentMapper musicEquipmentMapper;

    @Mock
    private GridFsService gridFsService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private MultipartFile mockImage;

    @InjectMocks
    private MusicEquipmentServiceImpl musicEquipmentService;

    private MusicEquipment musicEquipment;
    private MusicEquipmentRequestDTO requestDTO;
    private MusicEquipmentResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        musicEquipment = new MusicEquipment();
        musicEquipment.setId("1");
        musicEquipment.setName("Test Equipment");
        musicEquipment.setImage("imageId");

        requestDTO = new MusicEquipmentRequestDTO();
        requestDTO.setName("Test Equipment");
        requestDTO.setImage(mockImage);

        responseDTO = new MusicEquipmentResponseDTO();
        responseDTO.setId("1");
        responseDTO.setName("Test Equipment");
        responseDTO.setImage("imageId");
    }

    @Test
    void createMusicEquipment_Success() {
        when(musicEquipmentMapper.toEntity(any())).thenReturn(musicEquipment);
        when(gridFsService.saveFile(any(MultipartFile.class))).thenReturn("imageId");
        when(musicEquipmentRepository.save(any())).thenReturn(musicEquipment);
        when(musicEquipmentMapper.toDto(any())).thenReturn(responseDTO);

        MusicEquipmentResponseDTO result = musicEquipmentService.createMusicEquipment(requestDTO);

        assertNotNull(result);
        assertEquals("1", result.getId());
        assertEquals("Test Equipment", result.getName());
        assertEquals("imageId", result.getImage());

        verify(musicEquipmentMapper).toEntity(requestDTO);
        verify(gridFsService).saveFile(mockImage);
        verify(musicEquipmentRepository).save(musicEquipment);
        verify(musicEquipmentMapper).toDto(musicEquipment);
    }

    @Test
    void createMusicEquipment_WithoutImage() {
        requestDTO.setImage(null);
        when(musicEquipmentMapper.toEntity(any())).thenReturn(musicEquipment);
        when(musicEquipmentRepository.save(any())).thenReturn(musicEquipment);
        when(musicEquipmentMapper.toDto(any())).thenReturn(responseDTO);

        MusicEquipmentResponseDTO result = musicEquipmentService.createMusicEquipment(requestDTO);

        assertNotNull(result);
        assertEquals("1", result.getId());
        assertEquals("Test Equipment", result.getName());
        assertEquals("imageId", result.getImage());

        verify(musicEquipmentMapper).toEntity(requestDTO);
        verifyNoInteractions(gridFsService);
        verify(musicEquipmentRepository).save(musicEquipment);
        verify(musicEquipmentMapper).toDto(musicEquipment);
    }

    @Test
    void createMusicEquipment_WithEmptyName() {
        requestDTO.setName("");
        when(musicEquipmentMapper.toEntity(any())).thenReturn(musicEquipment);
        when(gridFsService.saveFile(any(MultipartFile.class))).thenReturn("imageId");
        when(musicEquipmentRepository.save(any())).thenReturn(musicEquipment);
        when(musicEquipmentMapper.toDto(any())).thenReturn(responseDTO);

        MusicEquipmentResponseDTO result = musicEquipmentService.createMusicEquipment(requestDTO);

        assertNotNull(result);
        assertEquals("1", result.getId());
        assertEquals("Test Equipment", result.getName());
        assertEquals("imageId", result.getImage());

        verify(musicEquipmentMapper).toEntity(requestDTO);
        verify(gridFsService).saveFile(mockImage);
        verify(musicEquipmentRepository).save(musicEquipment);
        verify(musicEquipmentMapper).toDto(musicEquipment);
    }

    @Test
    void createMusicEquipment_WithNullMapperResult() {
        when(musicEquipmentMapper.toEntity(any())).thenReturn(null);

        assertThrows(NullPointerException.class, () -> 
            musicEquipmentService.createMusicEquipment(requestDTO)
        );

        verify(musicEquipmentMapper).toEntity(requestDTO);
        verifyNoMoreInteractions(musicEquipmentMapper);
        verifyNoInteractions(gridFsService);
        verifyNoInteractions(musicEquipmentRepository);
    }

    @Test
    void updateMusicEquipment_Success() {
        when(musicEquipmentRepository.findById("1")).thenReturn(Optional.of(musicEquipment));
        when(gridFsService.updateFile(anyString(), any(MultipartFile.class))).thenReturn("newImageId");
        when(musicEquipmentRepository.save(any())).thenReturn(musicEquipment);
        when(musicEquipmentMapper.toDto(any())).thenReturn(responseDTO);

        MusicEquipmentResponseDTO result = musicEquipmentService.updateMusicEquipment("1", requestDTO);

        assertNotNull(result);
        assertEquals("1", result.getId());
        assertEquals("Test Equipment", result.getName());
        assertEquals("imageId", result.getImage());

        verify(musicEquipmentRepository).findById("1");
        verify(gridFsService).updateFile("imageId", mockImage);
        verify(musicEquipmentRepository).save(musicEquipment);
        verify(musicEquipmentMapper).toDto(musicEquipment);
    }

    @Test
    void updateMusicEquipment_WithoutImageChange() {
        requestDTO.setImage(null);
        when(musicEquipmentRepository.findById("1")).thenReturn(Optional.of(musicEquipment));
        when(musicEquipmentRepository.save(any())).thenReturn(musicEquipment);
        when(musicEquipmentMapper.toDto(any())).thenReturn(responseDTO);

        MusicEquipmentResponseDTO result = musicEquipmentService.updateMusicEquipment("1", requestDTO);

        assertNotNull(result);
        assertEquals("1", result.getId());
        assertEquals("Test Equipment", result.getName());
        assertEquals("imageId", result.getImage());

        verify(musicEquipmentRepository).findById("1");
        verifyNoInteractions(gridFsService);
        verify(musicEquipmentRepository).save(musicEquipment);
        verify(musicEquipmentMapper).toDto(musicEquipment);
    }

    @Test
    void updateMusicEquipment_NotFound() {
        when(musicEquipmentRepository.findById("1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
            musicEquipmentService.updateMusicEquipment("1", requestDTO)
        );

        verify(musicEquipmentRepository).findById("1");
        verifyNoMoreInteractions(musicEquipmentRepository);
        verifyNoInteractions(gridFsService);
        verifyNoInteractions(musicEquipmentMapper);
    }

    @Test
    void deleteMusicEquipment_Success() {
        when(musicEquipmentRepository.findById("1")).thenReturn(Optional.of(musicEquipment));
        doNothing().when(gridFsService).deleteFile(anyString());
        doNothing().when(musicEquipmentRepository).deleteById(anyString());

        musicEquipmentService.deleteMusicEquipment("1");

        verify(musicEquipmentRepository).findById("1");
        verify(gridFsService).deleteFile("imageId");
        verify(musicEquipmentRepository).deleteById("1");
    }

    @Test
    void deleteMusicEquipment_NotFound() {
        when(musicEquipmentRepository.findById("1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
            musicEquipmentService.deleteMusicEquipment("1")
        );

        verify(musicEquipmentRepository).findById("1");
        verifyNoMoreInteractions(musicEquipmentRepository);
        verifyNoInteractions(gridFsService);
        verifyNoInteractions(musicEquipmentMapper);
    }

    @Test
    void getMusicEquipmentById_Success() {
        when(musicEquipmentRepository.findById("1")).thenReturn(Optional.of(musicEquipment));
        when(musicEquipmentMapper.toDto(any())).thenReturn(responseDTO);

        MusicEquipmentResponseDTO result = musicEquipmentService.getMusicEquipmentById("1");

        assertNotNull(result);
        assertEquals("1", result.getId());
        assertEquals("Test Equipment", result.getName());
        assertEquals("imageId", result.getImage());

        verify(musicEquipmentRepository).findById("1");
        verify(musicEquipmentMapper).toDto(musicEquipment);
    }

    @Test
    void getMusicEquipmentById_NotFound() {
        when(musicEquipmentRepository.findById("1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
            musicEquipmentService.getMusicEquipmentById("1")
        );

        verify(musicEquipmentRepository).findById("1");
        verifyNoMoreInteractions(musicEquipmentRepository);
        verifyNoInteractions(musicEquipmentMapper);
    }

    @Test
    void getAllMusicEquipment_Success() {
        List<Product> products = Arrays.asList(musicEquipment);
        when(productRepository.findByType("MUSIC_EQUIPMENT")).thenReturn(products);
        when(musicEquipmentMapper.toDto(any())).thenReturn(responseDTO);

        List<MusicEquipmentResponseDTO> result = musicEquipmentService.getAllMusicEquipment();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("1", result.get(0).getId());
        assertEquals("Test Equipment", result.get(0).getName());
        assertEquals("imageId", result.get(0).getImage());

        verify(productRepository).findByType("MUSIC_EQUIPMENT");
        verify(musicEquipmentMapper).toDto(musicEquipment);
    }

    @Test
    void getAllMusicEquipment_EmptyList() {
        when(productRepository.findByType("MUSIC_EQUIPMENT")).thenReturn(Collections.emptyList());

        List<MusicEquipmentResponseDTO> result = musicEquipmentService.getAllMusicEquipment();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(productRepository).findByType("MUSIC_EQUIPMENT");
        verifyNoMoreInteractions(productRepository);
        verifyNoInteractions(musicEquipmentMapper);
    }

    @Test
    void updateMusicEquipment_WithNullMapperResult() {
        when(musicEquipmentRepository.findById("1")).thenReturn(Optional.of(musicEquipment));
        when(gridFsService.updateFile(anyString(), any(MultipartFile.class))).thenReturn("newImageId");
        when(musicEquipmentRepository.save(any())).thenReturn(musicEquipment);
        when(musicEquipmentMapper.toDto(any())).thenReturn(null);

        MusicEquipmentResponseDTO result = musicEquipmentService.updateMusicEquipment("1", requestDTO);

        assertNull(result);

        verify(musicEquipmentRepository).findById("1");
        verify(gridFsService).updateFile("imageId", mockImage);
        verify(musicEquipmentRepository).save(musicEquipment);
        verify(musicEquipmentMapper).toDto(musicEquipment);
    }

    @Test
    void createMusicEquipment_WithNullRequest() {
        assertThrows(IllegalArgumentException.class, () -> 
            musicEquipmentService.createMusicEquipment(null)
        );

        verifyNoInteractions(musicEquipmentMapper);
        verifyNoInteractions(gridFsService);
        verifyNoInteractions(musicEquipmentRepository);
    }

    @Test
    void updateMusicEquipment_WithNullRequest() {
        when(musicEquipmentRepository.findById("1")).thenReturn(Optional.of(musicEquipment));

        assertThrows(NullPointerException.class, () -> 
            musicEquipmentService.updateMusicEquipment("1", null)
        );

        verify(musicEquipmentRepository).findById("1");
        verifyNoMoreInteractions(musicEquipmentRepository);
        verifyNoInteractions(gridFsService);
        verifyNoInteractions(musicEquipmentMapper);
    }
} 