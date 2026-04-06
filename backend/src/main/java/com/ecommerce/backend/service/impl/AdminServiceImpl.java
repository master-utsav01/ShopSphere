package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.admin.AdminCreateRequest;
import com.ecommerce.backend.dto.admin.AdminDashboardSummaryResponse;
import com.ecommerce.backend.dto.admin.AdminOrderResponse;
import com.ecommerce.backend.dto.admin.AdminOrderStatusUpdateRequest;
import com.ecommerce.backend.dto.admin.AdminUserResponse;
import com.ecommerce.backend.dto.common.PageResponse;
import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.dto.order.OrderItemResponse;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.Role;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.AdminService;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardSummaryResponse getDashboardSummary() {
        return AdminDashboardSummaryResponse.builder()
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .totalCategories(categoryRepository.count())
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING) + orderRepository.countByStatus(OrderStatus.CONFIRMED))
                .deliveredOrders(orderRepository.countByStatus(OrderStatus.DELIVERED))
                .totalRevenue(orderRepository.sumTotalRevenue())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminOrderResponse> getOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.<AdminOrderResponse>builder()
                .content(orders.getContent().stream().map(this::toAdminOrderResponse).toList())
                .pageNumber(orders.getNumber())
                .pageSize(orders.getSize())
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .last(orders.isLast())
                .build();
    }

    @Override
    @Transactional
    public AdminOrderResponse updateOrderStatus(Long orderId, AdminOrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        order.setStatus(request.status());
        return toAdminOrderResponse(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminUserResponse> getUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.<AdminUserResponse>builder()
                .content(users.getContent().stream().map(this::toAdminUserResponse).toList())
                .pageNumber(users.getNumber())
                .pageSize(users.getSize())
                .totalElements(users.getTotalElements())
                .totalPages(users.getTotalPages())
                .last(users.isLast())
                .build();
    }

    @Override
    @Transactional
    public AdminUserResponse createAdmin(AdminCreateRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered");
        }

        User admin = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ADMIN)
                .build();

        User savedAdmin = userRepository.save(admin);
        cartRepository.save(Cart.builder().user(savedAdmin).build());
        return toAdminUserResponse(savedAdmin);
    }

    private AdminOrderResponse toAdminOrderResponse(Order order) {
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

        return AdminOrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .paymentMethod(order.getPaymentMethod())
                .locationLabel(order.getLocationLabel())
                .latitude(order.getLatitude())
                .longitude(order.getLongitude())
                .createdAt(order.getCreatedAt())
                .userId(order.getUser().getId())
                .userName(order.getUser().getFullName())
                .userEmail(order.getUser().getEmail())
                .items(items)
                .build();
    }

    private AdminUserResponse toAdminUserResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .totalOrders(user.getOrders().size())
                .build();
    }
}
