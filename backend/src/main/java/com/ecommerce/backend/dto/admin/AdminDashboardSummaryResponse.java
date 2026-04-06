package com.ecommerce.backend.dto.admin;

import java.math.BigDecimal;
import lombok.Builder;

@Builder
public record AdminDashboardSummaryResponse(
        long totalUsers,
        long totalProducts,
        long totalCategories,
        long totalOrders,
        long pendingOrders,
        long deliveredOrders,
        BigDecimal totalRevenue
) {
}
