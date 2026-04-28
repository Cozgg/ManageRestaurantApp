/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.dto.ItemDto;
import com.ccc.dto.OrderDto;
import com.ccc.payment.PaymentMethod;
import com.ccc.payment.PaymentStrategy;
import com.ccc.pojo.Orders;
import com.ccc.repository.OrderRepository;
import com.ccc.repository.UserRepository;
import com.ccc.service.OrderService;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Admin
 */
@Service
@PropertySource("classpath:momo.properties")
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private Map<String, PaymentStrategy> strategies;

    @Value("${momo.accessKey}")
    private String accessKey;
    @Value("${momo.secretKey}")
    private String secretKey;

    @Override
    public List<OrderDto> getOrders() {
        List<Orders> orders = this.orderRepo.getOrders();

        return orders.stream().map(o -> {
            OrderDto odto = new OrderDto();
            odto.setId(o.getId());
            odto.setUserId(o.getUserId().getId());
            odto.setReservationId(o.getReservationId().getId());
            odto.setTotalPrice(o.getTotalPrice());
            odto.setCreatedDate(o.getCreatedAt());
            if (o.getPaymentMethod() != null) {
                odto.setPayment(o.getPaymentMethod());
            }
            if (o.getStatusPay() != null) {
                odto.setStatusPay(o.getStatusPay());
            }

            return odto;
        }).collect(Collectors.toList());
    }

    @Override
    public OrderDto getOrderById(int orderId) {
        Orders o = this.orderRepo.getOrderById(orderId);
        OrderDto dto = new OrderDto();
        dto.setId(o.getId());
        dto.setUserId(o.getUserId().getId());
        dto.setCreatedDate(o.getCreatedAt());
        dto.setPayment(o.getPaymentMethod());
        dto.setStatusPay(o.getStatusPay());
        dto.setTotalPrice(o.getTotalPrice());
        dto.setReservationId(o.getReservationId() != null ? o.getReservationId().getId() : null);
        return dto;
    }

    @Override
    public String addOrder(ItemDto items) {
        Orders newOrder = new Orders();
        newOrder.setCreatedAt(new Date());

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        newOrder.setUserId(this.userRepo.getUserByUsername(username));

        newOrder.setPaymentMethod(items.getPaymentMethod());
        newOrder.setStatusPay("PENDING");
        newOrder.setTotalPrice(items.calculateTotalAmount());
        Orders saveOrder = this.orderRepo.addOrder(newOrder, items);
        PaymentStrategy payment = this.strategies.get(items.getPaymentMethod().name());

        if (payment == null) {
            throw new RuntimeException("Phương thức thanh toán không hợp lệ!");
        }
        int dbOrderId = saveOrder.getId();
        if (items.getPaymentMethod() == PaymentMethod.MOMO) {
            String momoOrderId = dbOrderId + "_" + System.currentTimeMillis();
            String payUrl = payment.pay(String.valueOf(momoOrderId), items.calculateTotalAmount());
            return payUrl;
        } else {
            return payment.pay(String.valueOf(saveOrder.getId()), items.calculateTotalAmount());
        }
    }

    @Override
    public boolean verifyMomoSignature(Map<String, Object> payload) {
        try {
            String signatureFromMoMo = payload.get("signature").toString();

            // Xử lý null an toàn cho các trường có thể không tồn tại
            String amount = payload.get("amount").toString();
            String extraData = payload.getOrDefault("extraData", "").toString();
            String message = payload.getOrDefault("message", "").toString();
            String orderId = payload.get("orderId").toString();
            String orderInfo = payload.getOrDefault("orderInfo", "").toString();
            String orderType = payload.get("orderType").toString();
            String partnerCode = payload.get("partnerCode").toString();
            String payType = payload.get("payType").toString();
            String requestId = payload.get("requestId").toString();
            String responseTime = payload.get("responseTime").toString();
            String resultCode = payload.get("resultCode").toString();
            String transId = payload.get("transId").toString();
            String rawHash = "accessKey=" + accessKey
                    + "&amount=" + amount
                    + "&extraData=" + extraData
                    + "&message=" + message
                    + "&orderId=" + orderId
                    + "&orderInfo=" + orderInfo
                    + "&orderType=" + orderType
                    + "&partnerCode=" + partnerCode
                    + "&payType=" + payType
                    + "&requestId=" + requestId
                    + "&responseTime=" + responseTime
                    + "&resultCode=" + resultCode
                    + "&transId=" + transId;

            String mySignature = hmacSHA256(rawHash, this.secretKey);
            return mySignature.equals(signatureFromMoMo);

        } catch (Exception e) {
            System.out.println("Lỗi xác thực IPN MoMo: " + e.getMessage());
            return false;
        }
    }

    private String hmacSHA256(String data, String secretKey) throws Exception {
        javax.crypto.Mac sha256_HMAC = javax.crypto.Mac.getInstance("HmacSHA256");
        javax.crypto.spec.SecretKeySpec secret_key = new javax.crypto.spec.SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] bytes = sha256_HMAC.doFinal(data.getBytes("UTF-8"));
        StringBuilder hash = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xFF & b);
            if (hex.length() == 1) {
                hash.append('0');
            }
            hash.append(hex);
        }
        return hash.toString();
    }

    @Override
    public void updateOrderStatus(int orderId, String status, Long transId) {
        this.orderRepo.updateOrderStatus(orderId, status, transId);
    }

    @Override
    public void updateOrderStatus(int orderId, String status) {
        this.orderRepo.updateOrderStatus(orderId, status);
    }

}
