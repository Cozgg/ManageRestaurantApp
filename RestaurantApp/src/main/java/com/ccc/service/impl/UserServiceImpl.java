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
import com.ccc.utils.UserFactory;
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
    
    @Autowired
    private com.ccc.repository.DishRepository dishRepo;
    
    @Override
    public User getUserByUsername(String username) {
        return this.userRepo.getUserByUsername(username);
    }

    @Override
    public User addUser(Map<String, String> params, MultipartFile avatar) {
        UserRole role = UserRole.valueOf(params.getOrDefault("userRole", "ROLE_USER"));
        User u = UserFactory.createUser(params, role);
        u.setPassword(this.passwordEncoder.encode(params.get("password")));
        
        if (avatar != null && !avatar.isEmpty()) {
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

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(int id) {
        User u = this.userRepo.getUserById(id);
        if (u != null) {
            // Logic chuyển giao món ăn nếu là CHEF
            if (u.getUserRole() == UserRole.ROLE_CHEF) {
                // Tìm một ADMIN hoặc CHEF khác để chuyển giao
                List<User> users = this.userRepo.getUsers();
                User successor = users.stream()
                        .filter(user -> (user.getUserRole() == UserRole.ROLE_ADMIN || 
                                        (user.getUserRole() == UserRole.ROLE_CHEF && user.getId() != id)) 
                                        && user.getActive() == true)
                        .findFirst()
                        .orElse(null);

                if (successor != null) {
                    this.dishRepo.transferDishes(id, successor.getId());
                } else {
                    // Nếu không có ai active, chuyển cho admin đầu tiên (id=1 hoặc bất kỳ admin nào)
                    User defaultAdmin = users.stream()
                            .filter(user -> user.getUserRole() == UserRole.ROLE_ADMIN)
                            .findFirst()
                            .orElse(null);
                    if (defaultAdmin != null) {
                        this.dishRepo.transferDishes(id, defaultAdmin.getId());
                    }
                }
            }
            this.userRepo.deleteUser(id);
        }
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public User updateUser(int id, Map<String, String> params, MultipartFile avatar) {
        User u = this.userRepo.getUserById(id);
        if (u != null) {
            if (params.containsKey("firstName")) u.setFirstName(params.get("firstName"));
            if (params.containsKey("lastName")) u.setLastName(params.get("lastName"));
            if (params.containsKey("phone")) u.setPhone(params.get("phone"));
            
            if (avatar != null && !avatar.isEmpty()) {
                try {
                    Map res = this.cloudinary.uploader().upload(avatar.getBytes(),
                            ObjectUtils.asMap("resource_type", "auto"));
                    u.setAvatar(res.get("secure_url").toString());
                } catch (IOException ex) {
                    Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            this.userRepo.updateUser(u);
        }
        return u;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void approveUser(int id) {
        User u = this.userRepo.getUserById(id);
        if (u != null && u.getUserRole() == UserRole.ROLE_CHEF) {
            u.setActive(true);
            this.userRepo.updateUser(u);
        }
    }
}
