/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service;

import com.ccc.dto.ItemDto;
import com.ccc.dto.OrderDto;
import com.ccc.pojo.Orders;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Admin
 */
public interface OrderService {
    List<OrderDto> getOrders();
    OrderDto getOrderById(int orderId);
    String addOrder(ItemDto items);
    boolean verifyMomoSignature(Map<String, Object> payload);
    void updateOrderStatus(int orderId, String status, Long transId);
    void updateOrderStatus(int orderId, String status);
}
