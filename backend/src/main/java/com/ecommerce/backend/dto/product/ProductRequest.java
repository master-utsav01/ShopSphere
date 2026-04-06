package com.ecommerce.backend.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "Product name is required")
        @Size(min = 2, max = 120, message = "Product name must be between 2 and 120 characters")
        String name,

        @NotBlank(message = "Product description is required")
        @Size(min = 10, max = 300, message = "Product description must be between 10 and 300 characters")
        String description,

        @NotNull(message = "Product price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
        BigDecimal price,

        @NotNull(message = "Stock quantity is required")
        @Min(value = 0, message = "Stock quantity cannot be negative")
        Integer stockQuantity,

        @Size(max = 255, message = "Image URL must not exceed 255 characters")
        String imageUrl,

        @NotNull(message = "Active flag is required")
        Boolean active,

        @NotNull(message = "Category id is required")
        Long categoryId
) {
}
