/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ccc.pojo.User;
import com.ccc.service.UserService;
import com.ccc.utils.JwtUtils;

/**
 *
 * @author Admin
 */
@RestController
@RequestMapping("/api")
public class ApiUserController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "/users",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> create(@RequestParam Map<String, String> params,
            @RequestParam(value = "avatar") MultipartFile avatar) {
        User u = this.userService.addUser(params, avatar);

        return new ResponseEntity<>(u, HttpStatus.CREATED);
    }

    @PostMapping(path = "/register",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> register(@RequestParam Map<String, String> params, @RequestParam(value = "avatar") MultipartFile avatar) {
        User newUser = this.userService.addUser(params, avatar);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

//    @GetMapping(path = "/users")
//    public ResponseEntity<List<User>> list(){
//        return new ResponseEntity<>(this.userService.getUsers(), HttpStatus.OK);
//    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User u) {
        try {
            if (this.userService.authenticate(u.getUsername(), u.getPassword())) {
                User uAuth = this.userService.getUserByUsername(u.getUsername());
                String role = uAuth.getUserRole().toString();
                String token = JwtUtils.generateToken(u.getUsername(), role);
                return ResponseEntity.ok().body(Collections.singletonMap("token", token));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
        } catch (jakarta.persistence.NoResultException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản không tồn tại");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
        }
    }

    @RequestMapping("/secure/profile")
    @ResponseBody
    @CrossOrigin
    public ResponseEntity<User> getProfile(Principal principal) {
        return new ResponseEntity<>(this.userService.getUserByUsername(principal.getName()), HttpStatus.OK);
    }

    @PatchMapping(path = "/secure/users/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@PathVariable int id,
            @RequestParam Map<String, String> params,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            Principal principal) {
        User currentUser = this.userService.getUserByUsername(principal.getName());

        if (currentUser.getId() != id && currentUser.getUserRole() != com.ccc.enums.UserRole.ROLE_ADMIN) {
            return new ResponseEntity<>("Bạn không có quyền sửa thông tin này", HttpStatus.FORBIDDEN);
        }

        User updated = this.userService.updateUser(id, params, avatar);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PostMapping("/users/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable int id, Principal principal) {
        User currentUser = this.userService.getUserByUsername(principal.getName());
        if (currentUser.getUserRole() != com.ccc.enums.UserRole.ROLE_ADMIN) {
            return new ResponseEntity<>("Bạn không có quyền duyệt người dùng", HttpStatus.FORBIDDEN);
        }
        this.userService.approveUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/secure/admin/users")
    public ResponseEntity<List<User>> getUsers(@RequestParam Map<String, String> params, Principal principal) {
        User currentUser = this.userService.getUserByUsername(principal.getName());
        if (currentUser.getUserRole() != com.ccc.enums.UserRole.ROLE_ADMIN) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(this.userService.getUsers(params), HttpStatus.OK);
    }
}
