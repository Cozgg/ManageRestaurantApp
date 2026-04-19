/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service;

import com.ccc.dto.UserDto;
import com.ccc.pojo.User;
import com.ccc.pojo.UserRole;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Admin
 */
public interface UserService extends UserDetailsService{
    User getUserByUsername(String username) ;
    User addUser(Map<String, String> params, MultipartFile avatar);
    User addUser(UserDto udto);
    List<User> getUsers();
    User getUserById(int userId);
    List<UserRole> getUserRoles();
    boolean authenticate(String username, String password);
}
