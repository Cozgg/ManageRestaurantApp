/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.utils;

import com.ccc.pojo.User;
import com.ccc.pojo.UserRole;
import java.util.Map;

/**
 * Factory Pattern for User creation
 * @author Admin
 */
public class UserFactory {

    public static User createUser(Map<String, String> params, UserRole role) {
        User user = new User();
        user.setUsername(params.get("username"));
        user.setFirstName(params.get("firstName"));
        user.setLastName(params.get("lastName"));
        user.setPhone(params.get("phone"));
        user.setUserRole(role);
        
        switch (role) {
            case ROLE_ADMIN:
                user.setActive(true); 
                break;
            case ROLE_CHEF:
                user.setActive(false); 
                break;
            case ROLE_USER:
                user.setActive(true);
                break;
            default:
                user.setActive(true);
        }
        
        return user;
    }
}
