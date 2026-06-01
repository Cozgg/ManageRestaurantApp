/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

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

import com.ccc.dto.ItemDto;
import com.ccc.dto.MomoIpnResponse;
import com.ccc.dto.OrderDetailDto;
import com.ccc.dto.OrderDto;
import com.ccc.dto.OrderItemDto;
import com.ccc.dto.UserDto;
import com.ccc.enums.PaymentMethod;
import com.ccc.payment.PaymentStrategy;
import com.ccc.pojo.OrderDetail;
import com.ccc.pojo.Orders;
import com.ccc.pojo.User;
import com.ccc.repository.OrderRepository;
import com.ccc.repository.UserRepository;
import com.ccc.service.OrderService;
import java.util.HashMap;
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
    public List<OrderDto> getOrders(User u, Map<String, String> params) {

        if (u == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thông tin USER không hợp lệ");
        }

        if (params == null) {
            params = new HashMap<>();
        }
        List<Orders> orders = this.orderRepo.getOrders(u, params);

        return orders.stream().map(o -> {
            UserDto udto = UserDto.builder().firstName(o.getUserId().getFirstName()).lastName(o.getUserId().getLastName()).build();
            OrderDto odto = OrderDto.builder().id(o.getId()).user(udto).totalPrice(o.getTotalPrice())
                    .payment(o.getPaymentMethod()).createdDate(o.getCreatedAt()).statusPay(o.getStatusPay())
                    .transactionId(o.getTransactionId() != null ? o.getTransactionId() : null).build();

            return odto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getAllOrders(Map<String, String> params) {
        // Create a dummy admin user to get all orders
        User adminUser = new User();
        adminUser.setUserRole(com.ccc.enums.UserRole.ROLE_ADMIN);

        List<Orders> orders = this.orderRepo.getOrders(adminUser, params);

        return orders.stream().map(o -> {
            UserDto udto = UserDto.builder().firstName(o.getUserId().getFirstName()).lastName(o.getUserId().getLastName()).build();
            OrderDto odto = OrderDto.builder().id(o.getId()).user(udto).totalPrice(o.getTotalPrice())
                    .payment(o.getPaymentMethod()).createdDate(o.getCreatedAt()).statusPay(o.getStatusPay())
                    .transactionId(o.getTransactionId() != null ? o.getTransactionId() : null).build();

            return odto;
        }).collect(Collectors.toList());
    }

    @Override
    public long countOrders(Map<String, String> params) {
        return this.orderRepo.countOrders(params);
    }

    @Override
    public OrderDetailDto getOrderById(int orderId) {
        if (orderId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id đơn hàng phải lớn hơn 0");
        }
        List<OrderDetail> details = this.orderRepo.getOrderDetailsByOrderId(orderId);
        if (details != null && !details.isEmpty()) {
            Orders o = details.get(0).getOrderId();
            UserDto u = UserDto.builder().firstName(o.getUserId().getFirstName()).lastName(o.getUserId().getLastName()).build();

            OrderDto odto = OrderDto.builder().id(o.getId()).user(u).totalPrice(o.getTotalPrice())
                    .payment(o.getPaymentMethod()).createdDate(o.getCreatedAt()).statusPay(o.getStatusPay()).build();

            List<OrderItemDto> items = details.stream().map(od -> {
                OrderItemDto itemDto = OrderItemDto.builder().dishId(od.getDishId().getId()).dishImage(od.getDishId().getImage())
                        .dishName(od.getDishId().getName()).quantity(od.getQuantity()).unitPrice(od.getUnitPrice()).chef(UserDto.builder()
                        .firstName(od.getDishId().getUserId().getFirstName()).lastName(od.getDishId().getUserId().getLastName()).build()).build();
                return itemDto;
            }).collect(Collectors.toList());
            OrderDetailDto dto = OrderDetailDto.builder().order(odto).items(items).build();
            return dto;
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy chi tiết đơn hàng cho ID: " + orderId);
    }

    @Override
    public OrderDetailDto getOrderById(int orderId, User currentChef) {

        if (orderId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID đơn hàng phải lớn hơn 0");
        }
        if (currentChef == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không tìm thấy thông tin đầu bếp hiện tại");
        }

        List<OrderDetail> details = this.orderRepo.getOrderDetailsByOrderId(orderId, currentChef);
        if (details != null && !details.isEmpty()) {
            Orders o = details.get(0).getOrderId();
            UserDto u = UserDto.builder().firstName(o.getUserId().getFirstName()).lastName(o.getUserId().getLastName()).build();

            OrderDto odto = OrderDto.builder().id(o.getId()).user(u).totalPrice(o.getTotalPrice())
                    .payment(o.getPaymentMethod()).createdDate(o.getCreatedAt()).statusPay(o.getStatusPay()).build();

            List<OrderItemDto> items = details.stream().map(od -> {
                OrderItemDto itemDto = OrderItemDto.builder().dishId(od.getDishId().getId()).dishImage(od.getDishId().getImage())
                        .dishName(od.getDishId().getName()).quantity(od.getQuantity()).unitPrice(od.getUnitPrice()).chef(UserDto.builder()
                        .firstName(od.getDishId().getUserId().getFirstName()).lastName(od.getDishId().getUserId().getLastName()).build()).build();
                return itemDto;
            }).collect(Collectors.toList());
            OrderDetailDto dto = OrderDetailDto.builder().order(odto).items(items).build();
            return dto;
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy chi tiết đơn hàng cho ID: " + orderId);
    }

    @Override
    @Transactional
    public String addOrder(ItemDto items) {

        if (items == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu đơn hàng không được để trống");
        }
        if (items.getPaymentMethod() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng chọn phương thức thanh toán");
        }
        if (items.getItems() == null || items.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng phải có ít nhất 1 món");
        }
        if (items.calculateTotalAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tổng tiền đơn hàng phải lớn hơn 0");
        }
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = this.userRepo.getUserByUsername(username);
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản người dùng");
        }

        Orders newOrder = new Orders();
        newOrder.setCreatedAt(new Date());

        newOrder.setUserId(currentUser);

        newOrder.setPaymentMethod(items.getPaymentMethod());
        newOrder.setStatusPay("PENDING");
        newOrder.setTotalPrice(items.calculateTotalAmount());
        Orders saveOrder = this.orderRepo.addOrder(newOrder, items);
        PaymentStrategy payment = this.strategies.get(items.getPaymentMethod().name());

        if (payment == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phương thức thanh toán " + items.getPaymentMethod().name() + " chưa được hỗ trợ");
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
    public boolean updateOrderStatus(int orderId, String status, Long transId) {
        Orders o = this.orderRepo.getOrderById(orderId);
        if (o == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng không tồn tại");
        }
        return this.orderRepo.updateOrderStatus(orderId, status, transId);
    }

    @Override
    public boolean updateOrderStatus(int orderId, String status) {
        Orders o = this.orderRepo.getOrderById(orderId);
        if (o == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng không tồn tại");
        }
        return this.orderRepo.updateOrderStatus(orderId, status);
    }

}
