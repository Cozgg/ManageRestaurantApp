/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository;

import com.ccc.pojo.OrderItem;
import com.ccc.pojo.Orders;
import java.util.List;

/**
 *
 * @author Admin
 */
public interface OrderRepository {
    void addOrder(List<OrderItem> items);
    List<Orders> getOrders();
    Orders getOrderById(int orderId);
}
