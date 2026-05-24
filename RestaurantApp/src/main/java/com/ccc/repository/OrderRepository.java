/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository;

import com.ccc.dto.ItemDto;
import com.ccc.pojo.OrderDetail;
import com.ccc.pojo.OrderItem;
import com.ccc.pojo.Orders;
import java.util.List;

/**
 *
 * @author Admin
 */
public interface OrderRepository {
    Orders addOrder(Orders order, ItemDto items);
    List<Orders> getOrders();
    Orders getOrderById(int orderId);
    List<OrderDetail> getOrderDetailsByOrderId(int orderId);
    void updateOrder(Orders order);
    void updateOrderStatus(int orderId, String status, Long transId);
    void updateOrderStatus(int orderId, String status);
}
