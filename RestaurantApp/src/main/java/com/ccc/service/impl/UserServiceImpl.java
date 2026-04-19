/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.dto.UserDto;
import com.ccc.pojo.User;
import com.ccc.pojo.UserRole;
import com.ccc.repository.UserRepository;
import com.ccc.service.UserService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Admin
 */
@Service("userDetailsService")
public class UserServiceImpl implements UserService{
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private Cloudinary cloudinary;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Override
    public User getUserByUsername(String username) {
        return this.userRepo.getUserByUsername(username);
    }

    @Override
    public User addUser(Map<String, String> params, MultipartFile avatar) {
        User u = new User();
        u.setFirstName(params.get("firstName"));
        u.setLastName(params.get("lastName"));
        u.setPhone(params.get("phone"));
        u.setUsername(params.get("username"));
        u.setPassword(passwordEncoder.encode(params.get("password")));
        String userRole = params.getOrDefault("userRole", "ROLE_USER");
        u.setUserRole(UserRole.valueOf(userRole));
        
        if (!avatar.isEmpty()) {
            try {
                Map res = this.cloudinary.uploader().upload(avatar.getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));
                u.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return this.userRepo.addUser(u);
    }
    
    @Override
    public User addUser(UserDto udto) {
        User u = new User();
        u.setFirstName(udto.getFirstName());
        u.setLastName(udto.getLastName());
        u.setPhone(udto.getPhone());
        u.setUsername(udto.getUsername());
        u.setPassword(passwordEncoder.encode(udto.getPassword()));
        String userRole = udto.getUserRole();
        u.setUserRole(UserRole.valueOf(userRole));
        if (!udto.getAvatar().isEmpty()) {
            try {
                Map res = this.cloudinary.uploader().upload(udto.getAvatar().getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));
                u.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return this.userRepo.addUser(u);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = this.userRepo.getUserByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("Không tồn tại!");
        }
        
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(String.valueOf(u.getUserRole())));
        
        return new org.springframework.security.core.userdetails.User(u.getUsername(),
                u.getPassword(), authorities);
    }

    @Override
    public List<User> getUsers() {
        return this.userRepo.getUsers();
    }

    @Override
    public User getUserById(int userId) {
        return this.userRepo.getUserById(userId);
    }

    @Override
    public List<UserRole> getUserRoles() {
        return Arrays.asList(UserRole.values());
    }
    
    @Override
    public boolean authenticate(String username, String password) {
        return this.userRepo.authenticate(username, password);
    }
    
}
