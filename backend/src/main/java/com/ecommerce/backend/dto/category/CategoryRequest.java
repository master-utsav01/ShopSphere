package com.ecommerce.backend.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "Category name is required")
        @Size(min = 2, max = 80, message = "Category name must be between 2 and 80 characters")
        String name,

        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description
) {
}
