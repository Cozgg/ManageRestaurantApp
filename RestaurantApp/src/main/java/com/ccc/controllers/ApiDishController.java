/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.DishDto;
import com.ccc.service.DishService;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    private com.ccc.service.RatingService ratingService;
    
    @Autowired
    private com.ccc.service.UserService userService;

    @GetMapping("/dishes")
    public ResponseEntity<List<DishDto>> list(@RequestParam Map<String, String> params) {
        return new ResponseEntity<>(this.dishService.getDishs(params), HttpStatus.OK);
    }

    @GetMapping("/dishes/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DishDto> getDish(@PathVariable Integer id) {
        DishDto dish = this.dishService.getDishById(id);
        if (dish == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(dish, HttpStatus.OK);
    }

    @PostMapping("/dishes")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<DishDto> addDish(
            @RequestParam Map<String, String> params,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        DishDto created = this.dishService.addDish(params, image);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/dishes/{id}")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<DishDto> updateDish(
            @PathVariable Integer id,
            @RequestParam Map<String, String> params,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        DishDto updated = this.dishService.updateDish(id, params, image);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/dishes/{id}")
    @PreAuthorize("hasRole('CHEF') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDish(@PathVariable Integer id) {
        boolean deleted = this.dishService.deleteDish(id);
        if (!deleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/dishes/{id}/rating")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<com.ccc.pojo.Rating> addRating(@PathVariable Integer id, 
                                                         @RequestParam Map<String, String> params, 
                                                         java.security.Principal principal) {
        com.ccc.pojo.User user = this.userService.getUserByUsername(principal.getName());
        params.put("dishId", id.toString());
        com.ccc.pojo.Rating r = this.ratingService.addRating(params, user);
        return new ResponseEntity<>(r, HttpStatus.CREATED);
    }

    @GetMapping("/dishes/{id}/rating")
    public ResponseEntity<List<com.ccc.pojo.Rating>> getRatings(@PathVariable Integer id) {
        return new ResponseEntity<>(this.ratingService.getRatingsByDishId(id), HttpStatus.OK);
    }
}
