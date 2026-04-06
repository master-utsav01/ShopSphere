package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.common.PageResponse;
import com.ecommerce.backend.dto.order.OrderItemResponse;
import com.ecommerce.backend.dto.order.OrderResponse;
import com.ecommerce.backend.dto.order.PlaceOrderRequest;
import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.service.OrderService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final Set<String> ALLOWED_PAYMENT_METHODS = Set.of(
            "COD",
            "UPI",
            "CREDIT_CARD",
            "DEBIT_CARD",
            "NET_BANKING",
            "WALLET"
    );

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public OrderResponse placeOrder(User user, PlaceOrderRequest request) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart not found for user"));

        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Cannot place an order with an empty cart");
        }
        if (!ALLOWED_PAYMENT_METHODS.contains(request.paymentMethod())) {
            throw new BadRequestException("Unsupported payment method selected");
        }
        if ((request.latitude() == null) != (request.longitude() == null)) {
            throw new BadRequestException("Both latitude and longitude are required when using current location");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            orderItems.add(OrderItem.builder()
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .build());
        }

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.CONFIRMED)
                .totalAmount(totalAmount)
                .shippingAddress(request.shippingAddress())
                .paymentMethod(request.paymentMethod())
                .locationLabel(request.locationLabel())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .orderItems(new ArrayList<>())
                .build();

        Order savedOrder = orderRepository.save(order);
        orderItems.forEach(item -> item.setOrder(savedOrder));
        savedOrder.getOrderItems().addAll(orderItems);

        Order persistedOrder = orderRepository.save(savedOrder);
        cart.getCartItems().clear();
        cartRepository.save(cart);

        return toResponse(persistedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getOrderHistory(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user, pageable);

        return PageResponse.<OrderResponse>builder()
                .content(orders.getContent().stream().map(this::toResponse).toList())
                .pageNumber(orders.getNumber())
                .pageSize(orders.getSize())
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .last(orders.isLast())
                .build();
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .locationLabel(order.getLocationLabel())
                .latitude(order.getLatitude())
                .longitude(order.getLongitude())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
