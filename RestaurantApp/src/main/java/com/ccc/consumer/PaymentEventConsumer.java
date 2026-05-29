/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.consumer;

import com.ccc.dto.ChefNotificationDto;
import com.ccc.dto.PaymentEventDto;
import java.util.HashMap;
import java.util.Map;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 *
 * @author Admin
 */
@Component
public class PaymentEventConsumer {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @RabbitListener(queues = "q.payment.send_email")
    public void handleSendEmail(PaymentEventDto event) {
        try {
            System.out.println("[Email] Đang gửi biên lai cho đơn hàng số: " + event.getOrderId());
        } catch (Exception e) {
            System.err.println("[Email] Lỗi hệ thống SMTP, dịch chuyển tin nhắn sang DLQ.");
            throw new AmqpRejectAndDontRequeueException("SMTP Failure", e);
        }
    }
    
    @RabbitListener(queues = "q.payment.notify_chef")
    public void handleNotifyChef(PaymentEventDto event) {
        try {
            System.out.println("[Bếp] Có đơn hàng mới đã thanh toán: " + event.getOrderId());
            
            ChefNotificationDto payload = ChefNotificationDto.builder().type("NEW_ORDER").orderId(event.getOrderId()).
                    message("Đơn hàng " + event.getOrderId() + " đã thanh toán xong. Vui lòng xem lịch sử đặt món!").build();
            
            messagingTemplate.convertAndSend("/topic/chef/orders", payload);
            
            System.out.println("[Bếp] Đã phát sóng tin nhắn qua WebSocket thành công!");

        } catch (Exception e) {
            System.err.println("[Bếp] Lỗi khi phát tin WebSocket, đẩy vào DLQ.");
            throw new AmqpRejectAndDontRequeueException("Lỗi WebSocket", e);
        }
    }

    @RabbitListener(queues = "q.payment.analytics")
    public void handleAnalytics(PaymentEventDto event) {
        try {
            System.out.println("[Log Doanh Thu] Đơn " + event.getOrderId() + " đã thanh toán: " + event.getAmount());
        } catch (Exception e) {
            throw new AmqpRejectAndDontRequeueException("Analytics Logging Failure", e);
        }
    }
    
}
