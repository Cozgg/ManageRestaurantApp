/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service;

import java.util.List;
import java.util.Map;

import com.ccc.dto.ItemDto;
import com.ccc.dto.MomoIpnResponse;
import com.ccc.dto.OrderDetailDto;
import com.ccc.dto.OrderDto;
import com.ccc.pojo.User;

/**
 *
 * @author Admin
 */
public interface OrderService {

    List<OrderDto> getOrders(User u, Map<String, String> params);

    List<OrderDto> getAllOrders(Map<String, String> params);

    long countOrders(Map<String, String> params);

    OrderDetailDto getOrderById(int orderId);

    OrderDetailDto getOrderById(int orderId, User currentChef);

    String addOrder(ItemDto items);

    boolean verifyMomoSignature(MomoIpnResponse payload);

    boolean updateOrderStatus(int orderId, String status, Long transId);

    boolean updateOrderStatus(int orderId, String status);

}
