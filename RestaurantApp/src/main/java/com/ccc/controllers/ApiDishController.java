/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.DishDto;
import com.ccc.pojo.Dish;
import com.ccc.service.DishService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@RequestMapping("/api")
public class ApiDishController {
    @Autowired
    private DishService dishService;
    
    @GetMapping("/dishes")
    public ResponseEntity<List<DishDto>> list(@RequestParam Map<String, String> params){
        return new ResponseEntity<>(this.dishService.getDishs(params), HttpStatus.OK);
    }
}
