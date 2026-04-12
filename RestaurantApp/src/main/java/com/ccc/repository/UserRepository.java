/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository;

import com.ccc.pojo.User;
import java.util.List;

/**
 *
 * @author Admin
 */
public interface UserRepository {
    User getUserByUsername(String username);
    User addUser(User u);
    List<User> getUsers();
    User getUserById(int userId);
}
