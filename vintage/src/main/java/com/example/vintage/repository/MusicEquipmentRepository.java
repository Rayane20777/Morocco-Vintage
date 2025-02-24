package com.example.vintage.repository;

import com.example.vintage.model.MusicEquipment;
import com.example.vintage.model.enums.MusicEquipmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MusicEquipmentRepository extends MongoRepository<MusicEquipment, Long> {
    List<MusicEquipment> findByEquipmentCondition(MusicEquipmentStatus equipmentCondition);
    List<MusicEquipment> findByModel(String model);
} 