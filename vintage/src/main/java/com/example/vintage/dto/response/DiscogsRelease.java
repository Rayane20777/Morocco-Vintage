package com.example.vintage.dto.response;

import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class DiscogsRelease {
    private int id;
    @JsonProperty("instance_id")
    private Long instanceId;
    @JsonProperty("date_added")
    private String dateAdded;
    private int rating;
    @JsonProperty("basic_information")
    private BasicInformation basicInformation;

    @Data
    public static class BasicInformation {
        private int id;
        @JsonProperty("master_id")
        private int masterId;
        @JsonProperty("master_url")
        private String masterUrl;
        @JsonProperty("resource_url")
        private String resourceUrl;
        private String thumb;
        @JsonProperty("cover_image")
        private String coverImage;
        private String title;
        private int year;
        private List<Format> formats;
        private List<Artist> artists;
        private List<String> genres;
        private List<String> styles;

        @Data
        public static class Artist {
            private String name;
            private String anv;
            private String join;
            private String role;
            private String tracks;
            private int id;
            @JsonProperty("resource_url")
            private String resourceUrl;
        }

        @Data
        public static class Format {
            private String name;
            private String qty;
            private String text;
            private List<String> descriptions;
        }
    }
} 