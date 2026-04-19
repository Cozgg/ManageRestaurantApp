/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.OrderDto;
import com.ccc.pojo.Orders;
import com.ccc.service.OrderService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@RequestMapping("/api")
public class ApiOrderController {
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping("/secure/orders")
    public ResponseEntity<List<OrderDto>> getOrders(){
        return new ResponseEntity<>(this.orderService.getOrders(), HttpStatus.OK);
    }
    
    @GetMapping("/secure/orders/{orderId}")
    public ResponseEntity<OrderDto> getOrders(@PathVariable(value = "orderId") int orderId){
        return new ResponseEntity<>(this.orderService.getOrderById(orderId), HttpStatus.OK);
    }
    
}
