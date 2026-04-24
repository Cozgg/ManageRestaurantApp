/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.CategoryDto;
import com.ccc.pojo.Category;
import com.ccc.service.CategoryService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@RequestMapping("/api")
public class ApiCategoryController {
    
    @Autowired
    private CategoryService cateService;
    
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> list(){
        return new ResponseEntity<>(this.cateService.getCates(), HttpStatus.OK);
    }
}
