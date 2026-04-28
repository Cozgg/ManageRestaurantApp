/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.MomoIpnResponse;
import com.ccc.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class ApiPaymentController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/momo-ipn")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void receiveMomoIpn(@RequestBody MomoIpnResponse response) {
        System.out.println(">>> ĐÃ NHẬN IPN TỪ MOMO: " + response.toString());

        try {
            if (response.getOrderId() == null) {
                System.out.println("MoMo không gửi kèm OrderId!");
                return;
            }

            String rawOrderId = response.getOrderId();
            String realOrderIdStr = rawOrderId.split("_")[0];
            int orderId = Integer.parseInt(realOrderIdStr);

            // 2. XỬ LÝ AN TOÀN transId: Nếu null thì gán tạm là 0L
            Long transId = response.getTransId() != null ? response.getTransId() : 0L;

            if (response.getResultCode() == 0) {
                orderService.updateOrderStatus(orderId, "COMPLETED", transId);
                System.out.println("✅ Đã cập nhật đơn " + orderId + " thành COMPLETED");
            } else {
                orderService.updateOrderStatus(orderId, "CANCELED", transId);
                System.out.println("❌ Đã cập nhật đơn " + orderId + " thành CANCELED. Lý do: " + response.getMessage());
            }

        } catch (Exception e) {
            // 3. IN CHI TIẾT LỖI: Để biết chính xác dòng nào làm sập code
            System.err.println("⚠️ Lỗi xử lý IPN:");
            e.printStackTrace(); 
        }
    }
}
