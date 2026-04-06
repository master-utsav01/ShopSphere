package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.common.PageResponse;
import com.ecommerce.backend.dto.product.ProductRequest;
import com.ecommerce.backend.dto.product.ProductResponse;
import java.math.BigDecimal;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long productId, ProductRequest request);

    void deleteProduct(Long productId);

    ProductResponse getProductById(Long productId);

    PageResponse<ProductResponse> getProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                              int page, int size, String sortBy, String direction);
}
