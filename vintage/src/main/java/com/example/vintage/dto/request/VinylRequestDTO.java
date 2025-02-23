package com.example.vintage.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class VinylRequestDTO {
    private String id; // _id
    private Long discogsId;
    private Long instanceId;
    private Date dateAdded; // Assuming this is a Date type
    private List<String> genres; // Array of genres
    private List<String> styles; // Array of styles
    private String thumbImageUrl; // Thumbnail image URL
    private String coverImageUrl; // Cover image URL
    private List<String> artists; // Array of artists
    private List<String> format; // Array of descriptions
    private Boolean active; // Active status
    private String name; // Name of the vinyl
    private String description; // Description of the vinyl
    private BigDecimal price; // Price
    private BigDecimal boughtPrice; // Bought price
    private int year; // Year of release
    private String status; // Status (e.g., "AVAILABLE")
    private MultipartFile image; // Use MultipartFile for file uploads
}