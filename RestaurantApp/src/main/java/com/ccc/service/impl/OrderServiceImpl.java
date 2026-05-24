/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.dto.ItemDto;
import com.ccc.dto.MomoIpnResponse;
import com.ccc.dto.OrderDetailDto;
import com.ccc.dto.OrderDto;
import com.ccc.dto.OrderItemDto;
import com.ccc.payment.PaymentMethod;
import com.ccc.payment.PaymentStrategy;
import com.ccc.pojo.OrderDetail;
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
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
            OrderDto odto = OrderDto.builder().id(o.getId()).userId(o.getUserId().getId()).totalPrice(o.getTotalPrice())
                    .payment(o.getPaymentMethod()).createdDate(o.getCreatedAt()).statusPay(o.getStatusPay())
                    .reservationId(o.getReservationId() != null
                            ? o.getReservationId().getId()
                            : null).build();

            return odto;
        }).collect(Collectors.toList());
    }

    @Override
    public OrderDetailDto getOrderById(int orderId) {
        List<OrderDetail> details = this.orderRepo.getOrderDetailsByOrderId(orderId);
        if(details != null && !details.isEmpty()){
            Orders o = details.get(0).getOrderId();
            OrderDto odto = OrderDto.builder().id(o.getId()).userId(o.getUserId().getId()).totalPrice(o.getTotalPrice())
                    .payment(o.getPaymentMethod()).createdDate(o.getCreatedAt()).statusPay(o.getStatusPay())
                    .reservationId(o.getReservationId() != null ? o.getReservationId().getId() : null).build();
            
            List<OrderItemDto> items = details.stream().map(od ->{
                OrderItemDto itemDto = OrderItemDto.builder().dishId(od.getDishId().getId()).dishImage(od.getDishId().getImage())
                        .dishName(od.getDishId().getName()).quantity(od.getQuantity()).unitPrice(od.getUnitPrice()).build();
                return itemDto;
            }).collect(Collectors.toList());
            OrderDetailDto dto = OrderDetailDto.builder().order(odto).items(items).build();
            return dto;
        }
        
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy chi tiết đơn hàng cho ID: " + orderId);
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
    public boolean verifyMomoSignature(MomoIpnResponse payload) {
        try {
            String signatureFromMoMo = payload.getSignature();

            // Xử lý null an toàn cho các trường có thể không tồn tại
            String amount = payload.getAmount().toString();
            String extraData = payload.getExtraData();
            String message = payload.getMessage();
            String orderId = payload.getOrderId();
            String orderInfo = payload.getOrderInfo();
            String orderType = payload.getOrderType();
            String partnerCode = payload.getPartnerCode();
            String payType = payload.getPayType();
            String requestId = payload.getRequestId();
            String responseTime = payload.getResponseTime().toString();
            String resultCode = payload.getResultCode().toString();
            String transId = payload.getTransId().toString();
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
