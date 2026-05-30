/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.OrderDetailDto;
import com.ccc.pojo.User;
import com.ccc.service.OrderService;
import com.ccc.service.UserService;
import java.security.Principal;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 *
 * @author Admin
 */
@Controller
@RequestMapping("/admin")
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/orders")
    public String ordersView(Model model, Principal principal, @RequestParam Map<String, String> params) {
        User u = userService.getUserByUsername(principal.getName());
        model.addAttribute("orders", this.orderService.getOrders(u, params));
        return "manage-order";
    }
    
    @PostMapping("/orders/{orderId}/confirm")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public void confirmOrder(@PathVariable(value = "orderId") int orderId){
        this.orderService.updateOrderStatus(orderId, "COMPLETED");
    }
}
