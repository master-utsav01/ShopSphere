package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.admin.AdminCreateRequest;
import com.ecommerce.backend.dto.admin.AdminDashboardSummaryResponse;
import com.ecommerce.backend.dto.admin.AdminOrderResponse;
import com.ecommerce.backend.dto.admin.AdminOrderStatusUpdateRequest;
import com.ecommerce.backend.dto.admin.AdminUserResponse;
import com.ecommerce.backend.dto.common.PageResponse;
import com.ecommerce.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/summary")
    public ResponseEntity<AdminDashboardSummaryResponse> getDashboardSummary() {
        return ResponseEntity.ok(adminService.getDashboardSummary());
    }

    @GetMapping("/orders")
    public ResponseEntity<PageResponse<AdminOrderResponse>> getOrders(@RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getOrders(page, size));
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<AdminOrderResponse> updateOrderStatus(@PathVariable Long orderId,
                                                                @Valid @RequestBody AdminOrderStatusUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateOrderStatus(orderId, request));
    }

    @GetMapping("/users")
    public ResponseEntity<PageResponse<AdminUserResponse>> getUsers(@RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getUsers(page, size));
    }

    @PostMapping("/users/admins")
    public ResponseEntity<AdminUserResponse> createAdmin(@Valid @RequestBody AdminCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createAdmin(request));
    }
}
