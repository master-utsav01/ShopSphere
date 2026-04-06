package com.ecommerce.backend.dto.product;

import com.ecommerce.backend.dto.category.CategoryResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer stockQuantity,
        String imageUrl,
        Boolean active,
        CategoryResponse category,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
