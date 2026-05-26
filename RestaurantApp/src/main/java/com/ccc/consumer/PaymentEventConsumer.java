/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.consumer;

import com.ccc.dto.PaymentEventDto;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 *
 * @author Admin
 */
@Component
public class PaymentEventConsumer {
    
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
            System.out.println("[Bếp] Bắn tín hiệu WebSocket báo món mới cho đơn: " + event.getOrderId());
        } catch (Exception e) {
            throw new AmqpRejectAndDontRequeueException("WebSocket Failure", e);
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
