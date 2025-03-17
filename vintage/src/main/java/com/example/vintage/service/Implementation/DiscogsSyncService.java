package com.example.vintage.service.Implementation;

import com.example.vintage.dto.response.DiscogsRelease;
import com.example.vintage.dto.response.DiscogsResponse;
import com.example.vintage.model.Vinyl;
import com.example.vintage.model.enums.ProductStatus;
import com.example.vintage.repository.VinylRepository;
import com.example.vintage.service.GridFsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.stream.Collectors;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.math.BigDecimal;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Map;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class DiscogsSyncService {

    private final RestTemplate restTemplate;
    private final VinylRepository vinylRepository;
    private final GridFsService gridFsService;

    @Value("${discogs.api.base-url}")
    private String baseUrl;

    public void syncDiscogsCollection(String username) {
        int page = 1;
        boolean hasMorePages = true;

        while (hasMorePages) {
            String url = String.format("%s/users/%s/collection/folders/0/releases?per_page=100&page=%d", baseUrl, username, page);
            try {
                ResponseEntity<String> rawResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    String.class
                );

                log.debug("Raw Response: {}", rawResponse.getBody());

                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                DiscogsResponse response = mapper.readValue(rawResponse.getBody(), DiscogsResponse.class);

                if (response != null && response.getReleases() != null) {
                    List<DiscogsRelease> releases = response.getReleases();
                    for (DiscogsRelease release : releases) {
                        try {
                            log.debug("Processing Release: {}", release);
                            Vinyl vinylToSave = convertToVinyl(release);
                            if (vinylToSave != null) {
                                log.debug("Vinyl to Save: {}", vinylToSave);
                                saveVinylWithImage(vinylToSave, release);
                            }
                        } catch (Exception e) {
                            log.error("Error processing release {}: {}", release.getId(), e.getMessage());
                            continue;
                        }
                    }
                    hasMorePages = response.getPagination().getNext() != null;
                    page++;
                } else {
                    hasMorePages = false;
                }
            } catch (Exception e) {
                log.error("Error fetching data from Discogs API: {}", e.getMessage());
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
                page++;
            }
        }
    }

    private Vinyl convertToVinyl(DiscogsRelease release) {
        try {
            Vinyl vinyl = new Vinyl();

            if (release != null) {
                vinyl.setDiscogsId((long) release.getId());
                vinyl.setInstanceId(release.getInstanceId());

                if (release.getDateAdded() != null) {
                    try {
                        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
                        Date dateAdded = dateFormat.parse(release.getDateAdded());
                        vinyl.setDateAdded(dateAdded);
                    } catch (ParseException e) {
                        log.warn("Error parsing date: {}", e.getMessage());
                        vinyl.setDateAdded(new Date());
                    }
                }

                if (release.getBasicInformation() != null) {
                    DiscogsRelease.BasicInformation basicInfo = release.getBasicInformation();
                    vinyl.setName(basicInfo.getTitle() != null ? basicInfo.getTitle() : "Unknown Title");
                    vinyl.setYear(basicInfo.getYear());

                    // Validate and set image URLs
                    String thumbUrl = basicInfo.getThumb();
                    String coverUrl = basicInfo.getCoverImage();
                    
                    try {
                        if (thumbUrl != null && !thumbUrl.isEmpty()) {
                            new java.net.URL(thumbUrl);
                            vinyl.setThumbImageUrl(thumbUrl);
                        } else {
                            vinyl.setThumbImageUrl(null);
                        }
                    } catch (java.net.MalformedURLException e) {
                        log.warn("Invalid thumb URL: {}", thumbUrl);
                        vinyl.setThumbImageUrl(null);
                    }
                    
                    try {
                        if (coverUrl != null && !coverUrl.isEmpty()) {
                            new java.net.URL(coverUrl);
                            vinyl.setCoverImageUrl(coverUrl);
                        } else {
                            vinyl.setCoverImageUrl(null);
                        }
                    } catch (java.net.MalformedURLException e) {
                        log.warn("Invalid cover URL: {}", coverUrl);
                        vinyl.setCoverImageUrl(null);
                    }
                    
                    if (basicInfo.getArtists() != null) {
                        vinyl.setArtists(basicInfo.getArtists().stream()
                            .map(artist -> artist.getName())
                            .collect(Collectors.toList()));
                    }

                    vinyl.setGenres(basicInfo.getGenres());
                    vinyl.setStyles(basicInfo.getStyles());

                    if (basicInfo.getFormats() != null && !basicInfo.getFormats().isEmpty()) {
                        DiscogsRelease.BasicInformation.Format firstFormat = basicInfo.getFormats().get(0);
                        if (firstFormat.getDescriptions() != null) {
                            vinyl.setFormat(new ArrayList<>(firstFormat.getDescriptions()));
                        } else {
                            vinyl.setFormat(new ArrayList<>());
                        }
                    }

                    vinyl.setActive(true);
                    vinyl.setDescription("Vinyl Record");
                    vinyl.setPrice("0.00");
                    vinyl.setBought_price("0.00");
                    vinyl.setStatus(ProductStatus.AVAILABLE);
                    vinyl.setImage(null);
                } else {
                    log.warn("Basic Information is null for release ID: {}", release.getId());
                }
                return vinyl;
            }
        } catch (Exception e) {
            log.error("Error converting release to vinyl: {}", e.getMessage());
        }
        return null;
    }

    private void saveVinylWithImage(Vinyl vinyl, DiscogsRelease release) {
        try {
            if (release == null || vinyl == null) return;

            // Handle image if URL is available
            if (release.getBasicInformation() != null && 
                release.getBasicInformation().getCoverImage() != null &&
                !release.getBasicInformation().getCoverImage().isEmpty()) {
                
                String imageUrl = release.getBasicInformation().getCoverImage();
                
                // Validate URL
                try {
                    java.net.URL url = new java.net.URL(imageUrl);
                    byte[] imageBytes = restTemplate.getForObject(imageUrl, byte[].class);
                    
                    if (imageBytes != null && imageBytes.length > 0) {
                        MultipartFile multipartFile = new MockMultipartFile(
                            "image",
                            "vinyl_image.jpg",
                            "image/jpeg",
                            imageBytes
                        );
                        String imageId = gridFsService.saveFile(multipartFile);
                        vinyl.setImage(imageId);
                    }
                } catch (java.net.MalformedURLException e) {
                    log.warn("Invalid image URL for vinyl {}: {}", vinyl.getName(), imageUrl);
                } catch (Exception e) {
                    log.error("Error downloading or processing image from URL {}: {}", imageUrl, e.getMessage());
                }
            }

            // Set the URLs from BasicInformation
            if (release.getBasicInformation() != null) {
                String thumbUrl = release.getBasicInformation().getThumb();
                String coverUrl = release.getBasicInformation().getCoverImage();

                if (thumbUrl != null && !thumbUrl.isEmpty()) {
                    vinyl.setThumbImageUrl(thumbUrl);
                    vinyl.setThumb(thumbUrl);  // Set both fields for compatibility
                }

                if (coverUrl != null && !coverUrl.isEmpty()) {
                    vinyl.setCoverImageUrl(coverUrl);
                    vinyl.setCoverImage(coverUrl);  // Set both fields for compatibility
                }
            }

            // Save the vinyl with all its data
            log.debug("Saving vinyl with data: {}", vinyl);
            vinylRepository.save(vinyl);
            log.info("Successfully saved vinyl: {} with ID: {}", vinyl.getName(), vinyl.getId());
        } catch (Exception e) {
            log.error("Error saving vinyl with image: {}", e.getMessage(), e);
        }
    }
} 