package com.ecommerce.backend.specification;

import com.ecommerce.backend.entity.Product;
import java.math.BigDecimal;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> withFilters(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice) {
        return Specification.where(nameContains(keyword))
                .and(hasCategory(categoryId))
                .and(priceGreaterThanOrEqualTo(minPrice))
                .and(priceLessThanOrEqualTo(maxPrice))
                .and(isActive());
    }

    private static Specification<Product> nameContains(String keyword) {
        return (root, query, cb) -> keyword == null || keyword.isBlank()
                ? cb.conjunction()
                : cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
    }

    private static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, cb) -> categoryId == null
                ? cb.conjunction()
                : cb.equal(root.get("category").get("id"), categoryId);
    }

    private static Specification<Product> priceGreaterThanOrEqualTo(BigDecimal minPrice) {
        return (root, query, cb) -> minPrice == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    private static Specification<Product> priceLessThanOrEqualTo(BigDecimal maxPrice) {
        return (root, query, cb) -> maxPrice == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    private static Specification<Product> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("active"));
    }
}
