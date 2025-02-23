package com.example.vintage.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AntiqueRequestDTO extends ProductRequestDTO {
    private String designer;
    private String origin;
} 