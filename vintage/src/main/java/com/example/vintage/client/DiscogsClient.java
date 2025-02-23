package com.example.vintage.client;

import com.example.vintage.dto.response.DiscogsRelease;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Collections;
import com.example.vintage.dto.response.DiscogsResponse;
import java.util.ArrayList;

@Component
public class DiscogsClient {
    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String apiSecret;
    private final String baseUrl;

    public DiscogsClient(
            @Value("${discogs.api.key}") String apiKey,
            @Value("${discogs.api.secret}") String apiSecret,
            @Value("${discogs.api.base-url:https://api.discogs.com}") String baseUrl
    ) {
        this.restTemplate = new RestTemplate();
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.baseUrl = baseUrl;
    }

    public DiscogsRelease getRelease(Long releaseId) {
        HttpHeaders headers = createHeaders();
        HttpEntity<?> entity = new HttpEntity<>(headers);
        
        String url = baseUrl + "/releases/" + releaseId;
        ResponseEntity<DiscogsRelease> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                DiscogsRelease.class
        );

        // Log the response status and body
        System.out.println("Response Status: " + response.getStatusCode());
        System.out.println("Response Body: " + response.getBody());

        return response.getBody();
    }

    public List<DiscogsRelease> getUserCollection(String username) {
        HttpHeaders headers = createHeaders();
        HttpEntity<?> entity = new HttpEntity<>(headers);
        
        String url = baseUrl + "/users/" + username + "/collection/folders/0/releases";
        
        ResponseEntity<DiscogsResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                DiscogsResponse.class
        );

        // Add debugging logs
        System.out.println("Response Status: " + response.getStatusCode());

        if (response.getBody() != null && response.getBody().getReleases() != null) {
            List<DiscogsRelease> releases = response.getBody().getReleases();
            
            // Fetch complete release information for each release
            List<DiscogsRelease> completeReleases = new ArrayList<>();
            for (DiscogsRelease release : releases) {
                try {
                    // Get complete release information using the release ID
                    DiscogsRelease completeRelease = getRelease(Long.valueOf(release.getId()));
                    if (completeRelease != null) {
                        // Copy over the instance ID from the collection release
                        completeRelease.setInstanceId(release.getInstanceId());
                        completeRelease.setDateAdded(release.getDateAdded());
                        completeReleases.add(completeRelease);
                        
                        // Log just one object in a raw format
                        System.out.println("Raw Release Data: " + completeRelease);
                        
                        // Optionally, log specific fields
                        System.out.println("ID: " + completeRelease.getId() + ", Master ID: " + completeRelease.getBasicInformation().getMasterId() + ", Cover Image: " + completeRelease.getBasicInformation().getCoverImage());
                    }
                } catch (Exception e) {
                    System.err.println("Error fetching complete release info for ID " + release.getId() + ": " + e.getMessage());
                }
                
                // Add a small delay to respect Discogs API rate limits
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    System.err.println("Thread interrupted: " + e.getMessage());
                }
            }
            
            return completeReleases;
        }
        
        return Collections.emptyList();
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Discogs key=" + apiKey + ", secret=" + apiSecret);
        headers.set("User-Agent", "VintageMarocApp/1.0");
        // Add accept header to ensure we get the full response
        headers.set("Accept", "application/json");
        return headers;
    }
} 