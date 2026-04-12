/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.pojo.User;
import com.ccc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author Admin
 */
@Controller
@RequestMapping("/admin")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/login")
    public String loginView() {
        return "login";
    }
    
    @GetMapping("/users")
    public String usersView(Model model){
        model.addAttribute("users",this.userService.getUsers());
        return "manage-user";
    }
    
    @GetMapping("/users/create")
    public String createUserView(Model model){
        model.addAttribute("user", new User());
        model.addAttribute("roles", this.userService.getUserRoles());
        return "users";
    }
    
    @GetMapping("/users/{userId}")
    public String updateUserView(Model model, @PathVariable("userId") int userId){
        model.addAttribute("user", this.userService.getUserById(userId));
        return "users";
    }
    
    @PostMapping("/users")
    public String createUser(@ModelAttribute(value = "user") User u){
        this.userService.addUser(u);
        return "redirect:/admin/users";
    }
}
