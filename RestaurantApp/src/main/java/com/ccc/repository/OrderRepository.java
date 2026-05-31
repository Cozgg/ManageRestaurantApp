/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository;

import java.util.List;
import java.util.Map;

import com.ccc.dto.ItemDto;
import com.ccc.pojo.OrderDetail;
import com.ccc.pojo.Orders;
import com.ccc.pojo.User;

/**
 *
 * @author Admin
 */
public interface OrderRepository {

    Orders addOrder(Orders order, ItemDto items);

    List<Orders> getOrders(User u, Map<String, String> params);

    Orders getOrderById(int orderId);

    List<OrderDetail> getOrderDetailsByOrderId(int orderId, User currentChef);

    List<OrderDetail> getOrderDetailsByOrderId(int orderId);

    void updateOrder(Orders order);

    void updateOrderStatus(int orderId, String status, Long transId);

    void updateOrderStatus(int orderId, String status);

    boolean hasUserPurchasedDish(User user, int dishId);
}
