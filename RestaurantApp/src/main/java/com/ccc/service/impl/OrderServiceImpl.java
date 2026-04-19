/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.dto.OrderDto;
import com.ccc.payment.PaymentMethod;
import com.ccc.pojo.Orders;
import com.ccc.repository.OrderRepository;
import com.ccc.service.OrderService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Admin
 */
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepo;

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
            if (o.getStatusOrder() != null) {
                odto.setStatusOrder(o.getStatusOrder());
            }

            return odto;
        }).collect(Collectors.toList());
    }

    @Override
    public OrderDto getOrderById(int orderId) {
        Orders o = this.orderRepo.getOrderById(orderId);
        OrderDto dto = new OrderDto(o.getId(), o.getUserId().getId(), o.getReservationId().getId(), o.getCreatedAt(),
                o.getPaymentMethod(), o.getTotalPrice(), o.getStatusPay(), o.getStatusOrder());
        return dto;
    }

}
