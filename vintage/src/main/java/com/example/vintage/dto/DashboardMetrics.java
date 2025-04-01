package com.example.vintage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetrics {
    private double totalRevenue;
    private long totalOrders;
    private long totalCustomers;
    private double revenueChange;
    private double ordersChange;
    private double customersChange;
} 