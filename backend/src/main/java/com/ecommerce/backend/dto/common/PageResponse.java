package com.ecommerce.backend.dto.common;

import java.util.List;
import lombok.Builder;

@Builder
public record PageResponse<T>(
        List<T> content,
        int pageNumber,
        int pageSize,
        long totalElements,
        int totalPages,
        boolean last
) {
}
