/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository;

import java.util.List;
import java.util.Map;

import com.ccc.pojo.User;

/**
 *
 * @author Admin
 */
public interface UserRepository {

    User getUserByUsername(String username);

    User addUser(User u);

    List<User> getUsers();

    List<User> getUsers(Map<String, String> params);

    long countUsers(Map<String, String> params);

    User getUserById(int userId);

    boolean authenticate(String username, String password);

    void deleteUser(int id);

    void updateUser(User u);
}
