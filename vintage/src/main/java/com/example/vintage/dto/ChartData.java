package com.example.vintage.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ChartData {
    private List<String> labels;
    private List<Double> salesData;
    private List<Integer> userData;
} 