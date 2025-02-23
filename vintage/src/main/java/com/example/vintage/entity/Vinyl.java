package com.example.vintage.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "vinyls")
public class Vinyl {

    @Id
    private String id; // Unique identifier for Vinyl
    private Long discogsId; // Discogs ID
    private Long instanceId; // Instance ID
    private Date dateAdded;
    private List<String> genres; // Array of genres
    private List<String> styles; // Array of styles
    private String thumbImageUrl; // Thumbnail image URL
    private String coverImageUrl; // Cover image URL
    private List<String> artists; // Array of artists
    private Boolean active;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal boughtPrice;
    private int year;
    private String status;
    private byte[] image; // Store image as binary data
    private String title;
    private String coverImage;
    private String thumb;
    private List<String> format;

} 