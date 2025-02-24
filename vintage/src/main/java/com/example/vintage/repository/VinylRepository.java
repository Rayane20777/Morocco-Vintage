package com.example.vintage.repository;

import com.example.vintage.model.Vinyl;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VinylRepository extends MongoRepository<Vinyl, String> {
    // Vinyl-specific queries
    List<Vinyl> findByGenresContaining(String genre);
    List<Vinyl> findByStylesContaining(String style);
    Optional<Vinyl> findByDiscogsId(Long discogsId);
    List<Vinyl> findByGenresContainingAndActiveTrue(String genres);
    List<Vinyl> findByStylesContainingAndActiveTrue(String styles);
    Optional<Vinyl> findByDiscogsIdAndActiveTrue(Long discogsId);
    List<Vinyl> findByActiveTrue();
}