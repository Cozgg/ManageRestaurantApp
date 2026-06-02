/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import java.security.Principal;
import java.util.Map;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ccc.dto.OrderDetailDto;
import com.ccc.dto.PaymentEventDto;
import com.ccc.pojo.User;
import com.ccc.service.OrderService;
import com.ccc.service.UserService;

/**
 *
 * @author Admin
 */
@Controller
@RequestMapping("/admin")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping("/orders")
    public String ordersView(Model model, Principal principal, @RequestParam Map<String, String> params) {
        User u = userService.getUserByUsername(principal.getName());

        int page = Integer.parseInt(params.getOrDefault("page", "1"));
        int pageSize = Integer.parseInt(params.getOrDefault("pageSize", "10"));
        params.put("page", String.valueOf(page));
        params.put("pageSize", String.valueOf(pageSize));

        long count = this.orderService.countOrders(params);
        int totalPages = (int) Math.ceil(count * 1.0 / pageSize);

        if (page > totalPages && totalPages > 0) {
            page = totalPages;
            params.put("page", String.valueOf(page));
        }
        if (page < 1) {
            page = 1;
            params.put("page", String.valueOf(page));
        }

        if (u.getUserRole() == com.ccc.enums.UserRole.ROLE_ADMIN) {
            model.addAttribute("orders", this.orderService.getAllOrders(params));
        } else {
            model.addAttribute("orders", this.orderService.getOrders(u, params));
        }

        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", pageSize);
        model.addAttribute("totalPages", totalPages);
        return "manage-order";
    }

    @PostMapping("/orders/{orderId}/confirm")
    @ResponseBody
    public ResponseEntity<?> confirmOrder(@PathVariable(value = "orderId") int orderId) {
        try {
            boolean isUpdated = this.orderService.updateOrderStatus(orderId, "COMPLETED");

            if (isUpdated) {
                OrderDetailDto o = this.orderService.getOrderById(orderId);

                if (o != null && o.getOrder() != null) {
                    PaymentEventDto event = PaymentEventDto.builder()
                            .orderId(String.valueOf(orderId))
                            .transactionId(o.getOrder().getTransactionId())
                            .amount(o.getOrder().getTotalPrice())
                            .build();

                    rabbitTemplate.convertAndSend("ex.payment_success", "", event);
                    System.out.println("Đã bắn sự kiện thanh toán lên RabbitMQ cho đơn: " + orderId);

                    return ResponseEntity.ok("Cập nhật trạng thái và bắn sự kiện thành công!");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Cập nhật thành công nhưng không lấy được thông tin chi tiết đơn hàng.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Không thể cập nhật trạng thái đơn hàng. Sự kiện chưa được gửi.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi hệ thống: " + e.getMessage());
        }
    }
}
