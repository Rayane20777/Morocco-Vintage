package com.example.vintage.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class    DiscogsResponse {
    private Pagination pagination;
    private List<DiscogsRelease> releases;

    @Data
    public static class Pagination {
        private int page;
        private int pages;
        private int per_page;
        private int items;
        private Urls urls;
        
        public String getNext() {
            return urls.getNext();
        }
        
        @Data
        public static class Urls {
            private String last;
            private String next;
        }
    }
} 