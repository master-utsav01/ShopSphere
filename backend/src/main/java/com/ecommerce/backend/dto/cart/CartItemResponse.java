package com.ecommerce.backend.dto.cart;

import java.math.BigDecimal;
import lombok.Builder;

@Builder
public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        String imageUrl,
        BigDecimal price,
        Integer quantity,
        BigDecimal subtotal
) {
}
