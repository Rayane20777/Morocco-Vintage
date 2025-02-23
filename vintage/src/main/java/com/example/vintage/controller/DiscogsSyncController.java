package com.example.vintage.controller;

import com.example.vintage.service.Implementation.DiscogsSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discogs")
public class DiscogsSyncController {

    private final DiscogsSyncService discogsSyncService;

    @Autowired
    public DiscogsSyncController(DiscogsSyncService discogsSyncService) {
        this.discogsSyncService = discogsSyncService;
    }

    @PostMapping("/sync")
    public ResponseEntity<String> syncCollection(@RequestParam String username) {
        try {
            discogsSyncService.syncDiscogsCollection(username);
            return ResponseEntity.ok("Sync completed successfully for user: " + username);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during sync: " + e.getMessage());
        }
    }
} 