/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service;

import com.ccc.dto.ItemDto;
import com.ccc.dto.MomoIpnResponse;
import com.ccc.dto.OrderDetailDto;
import com.ccc.dto.OrderDto;
import java.util.List;

/**
 *
 * @author Admin
 */
public interface OrderService {
    List<OrderDto> getOrders();
    OrderDetailDto getOrderById(int orderId);
    String addOrder(ItemDto items);
    boolean verifyMomoSignature(MomoIpnResponse payload);
    void updateOrderStatus(int orderId, String status, Long transId);
    void updateOrderStatus(int orderId, String status);
}
