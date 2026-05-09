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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Map;

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
    public ResponseEntity<List<CategoryDto>> list() {
        return new ResponseEntity<>(this.cateService.getCates(), HttpStatus.OK);
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDto> add(@RequestParam Map<String, String> params) {
        return new ResponseEntity<>(this.cateService.addCategory(params), HttpStatus.CREATED);
    }

    @PatchMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDto> update(@PathVariable int id, @RequestParam Map<String, String> params) {
        return new ResponseEntity<>(this.cateService.updateCategory(id, params), HttpStatus.OK);
    }

    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable int id) {
        boolean deleted = this.cateService.deleteCategory(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>("Không thể xóa danh mục còn chứa món ăn", HttpStatus.CONFLICT);
    }
}
