/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.UserDto;
import com.ccc.pojo.User;
import com.ccc.service.ReservationService;
import com.ccc.service.UserService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
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
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ReservationService reservationService;
    
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
        model.addAttribute("userDto", new UserDto());
        model.addAttribute("roles", this.userService.getUserRoles());
        return "users";
    }
    
    @GetMapping("/users/{userId}")
    public String updateUserView(Model model, @PathVariable("userId") int userId){
        model.addAttribute("user", this.userService.getUserById(userId));
        return "users";
    }
    
    @PostMapping("/users")
    public String createUser(@ModelAttribute(value = "userDto") UserDto u){
        this.userService.addUser(u);
        return "redirect:/admin/users";
    }
    
    @GetMapping("/reservations")
    public String reservationsView(Model model, @RequestParam(value = "status", required = false) String status){
        Map<String, String> params = new java.util.HashMap<>();
        if (status != null && !status.isEmpty()) {
            params.put("status", status);
        }
        model.addAttribute("reservations", this.reservationService.getReservations(params));
        return "manage-reservation";
    }
    
    @DeleteMapping("/users/{id}")
    @ResponseBody
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable(value = "id") int id) {
        this.userService.deleteUser(id);
    }
    
    @PostMapping("/users/{userId}/approve")
    public String approveUser(@PathVariable("userId") int userId){
        this.userService.approveUser(userId);
        return "redirect:/admin/users";
    }
    
    @PostMapping("/reservations/{reservationId}/confirm")
    public String confirmReservation(@PathVariable("reservationId") int reservationId){
        this.reservationService.updateReservation(reservationId, Map.of("status", "CONFIRMED"));
        return "redirect:/admin/reservations";
    }
    
    @PostMapping("/reservations/{reservationId}/cancel")
    public String cancelReservation(@PathVariable("reservationId") int reservationId){
        this.reservationService.deleteReservation(reservationId);
        return "redirect:/admin/reservations";
    }
    
    @PostMapping("/walk-in")
    public String createWalkIn(@RequestParam Map<String, String> params){
        this.reservationService.createWalkInReservation(params);
        return "redirect:/admin/reservations";
    }
}
