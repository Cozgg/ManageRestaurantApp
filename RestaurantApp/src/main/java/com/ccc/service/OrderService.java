/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service;

import com.ccc.dto.ItemDto;
import com.ccc.dto.MomoIpnResponse;
import com.ccc.dto.OrderDetailDto;
import com.ccc.dto.OrderDto;
import com.ccc.pojo.User;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Admin
 */
public interface OrderService {
    List<OrderDto> getOrders(User u, Map<String, String> params);
    OrderDetailDto getOrderById(int orderId);
    OrderDetailDto getOrderById(int orderId, User currentChef);
    String addOrder(ItemDto items);
    boolean verifyMomoSignature(MomoIpnResponse payload);
    void updateOrderStatus(int orderId, String status, Long transId);
    void updateOrderStatus(int orderId, String status);
}
