package com.example.vintage.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class VinylRequestDTO extends ProductRequestDTO {
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

}