/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.MomoIpnResponse;
import com.ccc.dto.PaymentEventDto;
import com.ccc.service.OrderService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    

    @PostMapping("/momo-ipn")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void receiveMomoIpn(@RequestBody MomoIpnResponse response) {
        System.out.println(">>> ĐÃ NHẬN IPN TỪ MOMO: " + response.toString());
        boolean isValid = orderService.verifyMomoSignature(response);
        if (!isValid) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid MoMo signature"
            );
        }

        try {
            if (response.getOrderId() == null) {
                System.out.println("MoMo không gửi kèm OrderId!");
                return;
            }

            String rawOrderId = response.getOrderId();
            String realOrderIdStr = rawOrderId.split("_")[0];
            int orderId = Integer.parseInt(realOrderIdStr);

            Long transId = response.getTransId() != null ? response.getTransId() : 0L;

            if (response.getResultCode() == 0) {
                orderService.updateOrderStatus(orderId, "COMPLETED", transId);
                System.out.println("Đã cập nhật đơn " + orderId + " thành COMPLETED");
                
                PaymentEventDto event = PaymentEventDto.builder().orderId(String.valueOf(orderId)).
                        transactionId(String.valueOf(transId)).amount(response.getAmount()).build();
                rabbitTemplate.convertAndSend("ex.payment_success", "", event);
                System.out.println("Đã bắn sự kiện thanh toán lên RabbitMQ cho đơn: " + orderId);
            } else {
                orderService.updateOrderStatus(orderId, "CANCELED", transId);
                System.out.println("Đã cập nhật đơn " + orderId + " thành CANCELED. Lý do: " + response.getMessage());
            }

        } catch (Exception e) {
            System.err.println("⚠️ Lỗi xử lý IPN:");
            e.printStackTrace();
        }
    }
}
