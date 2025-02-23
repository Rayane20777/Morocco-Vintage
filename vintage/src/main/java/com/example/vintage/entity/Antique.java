package com.example.vintage.entity;

import lombok.Data;
import org.springframework.data.annotation.TypeAlias;

@Data
@TypeAlias("antique")
public class Antique extends Product {
    private String designer;
    private String origin;
} 