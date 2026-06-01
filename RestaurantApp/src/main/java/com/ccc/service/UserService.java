/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

import com.ccc.dto.UserDto;
import com.ccc.enums.UserRole;
import com.ccc.pojo.User;

/**
 *
 * @author Admin
 */
public interface UserService extends UserDetailsService {

    User getUserByUsername(String username);

    User addUser(Map<String, String> params, MultipartFile avatar);

    User addUser(UserDto udto);

    User addUserFromJson(User u);

    User addUserDirect(User u);

    String encodePassword(String rawPassword);

    List<User> getUsers();

    List<User> getUsers(Map<String, String> params);

    long countUsers(Map<String, String> params);

    User getUserById(int userId);

    List<UserRole> getUserRoles();

    boolean authenticate(String username, String password);

    void deleteUser(int id);

    User updateUser(int id, Map<String, String> params, MultipartFile avatar);

    void approveUser(int id);
}
