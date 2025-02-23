package com.example.vintage.repository;

import com.example.vintage.entity.Vinyl;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.util.StringUtils;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.MalformedURLException;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Optional;

@Repository
public interface VinylRepository extends MongoRepository<Vinyl, String> {
   List<Vinyl> findByGenresContaining(String genres);
    List<Vinyl> findByStylesContaining(String styles);
    Optional<Vinyl> findByDiscogsId(Long discogsId);
    List<Vinyl> findByGenresContainingAndActiveTrue(String genres);
    List<Vinyl> findByStylesContainingAndActiveTrue(String styles);
    Optional<Vinyl> findByDiscogsIdAndActiveTrue(Long discogsId);
    List<Vinyl> findByActiveTrue();
}