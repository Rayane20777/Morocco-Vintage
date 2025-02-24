package com.example.vintage.service.Implementation;

import com.example.vintage.dto.response.DiscogsRelease;
import com.example.vintage.dto.response.DiscogsResponse;
import com.example.vintage.model.Vinyl;
import com.example.vintage.model.enums.ProductStatus;
import com.example.vintage.repository.VinylRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.math.BigDecimal;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;

@Service
public class DiscogsSyncService {

    private final RestTemplate restTemplate;
    private final VinylRepository vinylRepository;

    @Value("${discogs.api.base-url}")
    private String baseUrl;

    @Autowired
    public DiscogsSyncService(RestTemplate restTemplate, VinylRepository vinylRepository) {
        this.restTemplate = restTemplate;
        this.vinylRepository = vinylRepository;
    }

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

                System.out.println("Raw Response: " + rawResponse.getBody());

                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                DiscogsResponse response = mapper.readValue(rawResponse.getBody(), DiscogsResponse.class);

                if (response != null && response.getReleases() != null) {
                    List<DiscogsRelease> releases = response.getReleases();
                    for (DiscogsRelease release : releases) {
                        try {
                            System.out.println("Processing Release: " + release);
                            Vinyl vinylToSave = convertToVinyl(release);
                            if (vinylToSave != null) {
                                System.out.println("Vinyl to Save: " + vinylToSave);
                                vinylRepository.save(vinylToSave);
                            }
                        } catch (Exception e) {
                            System.err.println("Error processing release " + release.getId() + ": " + e.getMessage());
                            continue;
                        }
                    }
                    hasMorePages = response.getPagination().getNext() != null;
                    page++;
                } else {
                    hasMorePages = false;
                }
            } catch (Exception e) {
                System.err.println("Error fetching data from Discogs API: " + e.getMessage());
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
                        System.out.println("Error parsing date: " + e.getMessage());
                        vinyl.setDateAdded(new Date());
                    }
                }

                if (release.getBasicInformation() != null) {
                    DiscogsRelease.BasicInformation basicInfo = release.getBasicInformation();
                    vinyl.setName(basicInfo.getTitle() != null ? basicInfo.getTitle() : "Unknown Title");
                    vinyl.setYear(basicInfo.getYear());

                    System.out.println("Thumb URL: " + basicInfo.getThumb());
                    System.out.println("Cover Image URL: " + basicInfo.getCoverImage());

                    vinyl.setThumbImageUrl(basicInfo.getThumb() != null && !basicInfo.getThumb().isEmpty() ? basicInfo.getThumb() : "default_thumb_url");
                    vinyl.setCoverImageUrl(basicInfo.getCoverImage() != null && !basicInfo.getCoverImage().isEmpty() ? basicInfo.getCoverImage() : "default_cover_url");

                    System.out.println("Raw Basic Information: " + basicInfo);
                    
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
                    vinyl.setPrice(new BigDecimal("0.00"));
                    vinyl.setBought_price(new BigDecimal("0.00"));
                    vinyl.setStatus(ProductStatus.AVAILABLE);
                    vinyl.setImage(new byte[0]);
                } else {
                    System.out.println("Basic Information is null for release ID: " + release.getId());
                }
                return vinyl;
            }
        } catch (Exception e) {
            System.err.println("Error converting release to vinyl: " + e.getMessage());
        }
        return null;
    }
} 