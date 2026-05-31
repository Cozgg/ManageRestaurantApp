/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ccc.dto.DishDto;
import com.ccc.enums.UserRole;
import com.ccc.pojo.Rating;
import com.ccc.pojo.User;
import com.ccc.repository.OrderRepository;
import com.ccc.service.DishService;
import com.ccc.service.RatingService;
import com.ccc.service.UserService;

/**
 *
 * @author Admin
 */
@RestController
@RequestMapping("/api")
public class ApiDishController {

    @Autowired
    private DishService dishService;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/dishes")
    public ResponseEntity<List<DishDto>> list(@RequestParam Map<String, String> params) {
        return new ResponseEntity<>(this.dishService.getDishs(params), HttpStatus.OK);
    }

    @GetMapping("/secure/chef/dishes")
    public ResponseEntity<List<DishDto>> list(@RequestParam Map<String, String> params, Principal principal) {
        User currentChef = this.userService.getUserByUsername(principal.getName());
        return new ResponseEntity<>(this.dishService.getDishs(params, currentChef), HttpStatus.OK);
    }

    @GetMapping("/dishes/{id}")
    public ResponseEntity<DishDto> getDish(@PathVariable(value = "id") Integer id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        DishDto dish = this.dishService.getDishById(id);
        if (dish == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(dish, HttpStatus.OK);
    }

    @PostMapping("/secure/chef/dishes")
    public ResponseEntity<?> addDish(
            @RequestParam Map<String, String> params,
            @RequestParam(value = "image", required = false) MultipartFile image, Principal principal) throws IOException {
        User u = this.userService.getUserByUsername(principal.getName());
        if(u.getUserRole() != UserRole.ROLE_CHEF){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        DishDto created = this.dishService.addDish(params, image, u);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/secure/chef/dishes/{id}")
    public ResponseEntity<?> updateDish(
            @PathVariable(value = "id") Integer id,
            @RequestParam Map<String, String> params,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        DishDto updated = this.dishService.updateDish(id, params, image);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/secure/chef/dishes/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable(value = "id") Integer id) {
        boolean deleted = this.dishService.deleteDish(id);
        if (!deleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/secure/dishes/{id}/rating")
    public ResponseEntity<?> addRating(@PathVariable(value = "id") Integer id,
            @RequestParam Map<String, String> params,
            Principal principal) {
        User currentUser = this.userService.getUserByUsername(principal.getName());

        // Kiểm tra user đã đánh giá món này chưa
        Rating existingRating = this.ratingService.getRatingByUserAndDish(currentUser, id);
        if (existingRating != null) {
            return new ResponseEntity<>("Bạn đã đánh giá món này rồi!", HttpStatus.BAD_REQUEST);
        }

        // Kiểm tra user đã mua món này chưa (chỉ cho phép đánh giá nếu đã mua và đơn hàng hoàn thành)
        boolean hasPurchased = this.orderRepository.hasUserPurchasedDish(currentUser, id);
        if (!hasPurchased) {
            return new ResponseEntity<>("Bạn chưa mua món này hoặc đơn hàng chưa hoàn thành!", HttpStatus.FORBIDDEN);
        }

        params.put("dishId", id.toString());
        Rating r = this.ratingService.addRating(params, currentUser);
        return new ResponseEntity<>(r, HttpStatus.CREATED);
    }

    @GetMapping("/dishes/{id}/rating")
    public ResponseEntity<List<Rating>> getRatings(@PathVariable(value = "id") Integer id) {
        return new ResponseEntity<>(this.ratingService.getRatingsByDishId(id), HttpStatus.OK);
    }
}
