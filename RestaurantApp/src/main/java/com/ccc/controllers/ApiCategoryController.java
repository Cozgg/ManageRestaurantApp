/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.CategoryDto;
import com.ccc.enums.UserRole;
import com.ccc.pojo.User;
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
import java.security.Principal;
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
    
    @Autowired
    private com.ccc.service.UserService userService;
    
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> list() {
        return new ResponseEntity<>(this.cateService.getCates(), HttpStatus.OK);
    }

    @PostMapping("/categories")
    public ResponseEntity<?> add(@RequestParam Map<String, String> params, Principal principal) {
        User currentUser = this.userService.getUserByUsername(principal.getName());
        if (currentUser.getUserRole() != UserRole.ROLE_ADMIN) {
            return new ResponseEntity<>("Bạn không có quyền thêm danh mục", HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(this.cateService.addCategory(params), HttpStatus.CREATED);
    }

    @PatchMapping("/categories/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestParam Map<String, String> params, Principal principal) {
        User currentUser = this.userService.getUserByUsername(principal.getName());
        if (currentUser.getUserRole() != UserRole.ROLE_ADMIN) {
            return new ResponseEntity<>("Bạn không có quyền sửa danh mục", HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(this.cateService.updateCategory(id, params), HttpStatus.OK);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<String> delete(@PathVariable int id, Principal principal) {
        User currentUser = this.userService.getUserByUsername(principal.getName());
        if (currentUser.getUserRole() != UserRole.ROLE_ADMIN) {
            return new ResponseEntity<String>("Bạn không có quyền xóa danh mục", HttpStatus.FORBIDDEN);
        }
        boolean deleted = this.cateService.deleteCategory(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>("Không thể xóa danh mục còn chứa món ăn", HttpStatus.CONFLICT);
    }
}
