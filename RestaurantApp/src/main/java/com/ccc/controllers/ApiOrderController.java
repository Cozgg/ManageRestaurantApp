/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.ItemDto;
import com.ccc.dto.OrderDetailDto;
import com.ccc.dto.OrderDto;
import com.ccc.pojo.Orders;
import com.ccc.pojo.User;
import com.ccc.service.OrderService;
import com.ccc.service.UserService;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @Autowired
    private UserService userService;

    @GetMapping("/secure/orders")
    public ResponseEntity<List<OrderDto>> getOrders(@RequestParam Map<String, String> params) {
        User u = userService.getUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return new ResponseEntity<>(this.orderService.getOrders(u, params), HttpStatus.OK);
    }

    @GetMapping("/secure/orders/{orderId}")
    public ResponseEntity<OrderDetailDto> getOrderDetail(@PathVariable(value = "orderId") int orderId) {
        return new ResponseEntity<>(this.orderService.getOrderById(orderId), HttpStatus.OK);
    }

    @GetMapping("/secure/chef/orders/{orderId}")
    public ResponseEntity<OrderDetailDto> getOrderDetail(@PathVariable(value = "orderId") int orderId, Principal principal) {
        User currentChef = userService.getUserByUsername(principal.getName());
        return new ResponseEntity<>(this.orderService.getOrderById(orderId, currentChef), HttpStatus.OK);
    }

    @PostMapping("/secure/orders")
    public ResponseEntity<String> addOrder(@RequestBody ItemDto request) {
        String url = this.orderService.addOrder(request);
        return new ResponseEntity<>(url, HttpStatus.CREATED);
    }

    @GetMapping("/secure/admin/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders(@RequestParam Map<String, String> params, Principal principal) {
        User currentUser = userService.getUserByUsername(principal.getName());
        if (currentUser.getUserRole() != com.ccc.enums.UserRole.ROLE_ADMIN) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(this.orderService.getAllOrders(params), HttpStatus.OK);
    }
}
