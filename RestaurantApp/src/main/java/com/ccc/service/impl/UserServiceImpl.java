/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.ccc.dto.UserDto;
import com.ccc.enums.UserRole;
import com.ccc.pojo.User;
import com.ccc.repository.DishRepository;
import com.ccc.repository.UserRepository;
import com.ccc.service.UserService;
import com.ccc.utils.UserFactory;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

/**
 *
 * @author Admin
 */
@Service("userDetailsService")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private DishRepository dishRepo;

    @Override
    public User getUserByUsername(String username) {
        return this.userRepo.getUserByUsername(username);
    }

    @Override
    public User addUser(Map<String, String> params, MultipartFile avatar) {
        String username = params.get("username");
        if (username == null || username.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên đăng nhập không được để trống");
        }

        String password = params.get("password");
        if (password == null || password.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu không được để trống");
        }

        String firstName = params.get("firstName");
        if (firstName == null || firstName.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên không được để trống");
        }

        String lastName = params.get("lastName");
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Họ không được để trống");
        }

        String phone = params.get("phone");
        if (phone == null || phone.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại không được để trống");
        }

        String email = params.get("email");
        if (email == null || email.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email không được để trống");
        }

        if (avatar == null || avatar.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ảnh đại diện không được để trống");
        }

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
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi upload ảnh");
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
        u.setEmail(udto.getEmail());
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
    public User addUserFromJson(User u) {
        u.setPassword(this.passwordEncoder.encode(u.getPassword()));
        if (u.getUserRole() == null) {
            u.setUserRole(UserRole.ROLE_USER);
        }
        if (u.getActive() == null) {
            u.setActive(true);
        }
        return this.userRepo.addUser(u);
    }

    @Override
    public User addUserDirect(User u) {
        return this.userRepo.addUser(u);
    }

    @Override
    public String encodePassword(String rawPassword) {
        return this.passwordEncoder.encode(rawPassword);
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
    public List<User> getUsers(Map<String, String> params) {
        return this.userRepo.getUsers(params);
    }

    @Override
    public long countUsers(Map<String, String> params) {
        return this.userRepo.countUsers(params);
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
                        .filter(user -> (user.getUserRole() == UserRole.ROLE_ADMIN
                        || (user.getUserRole() == UserRole.ROLE_CHEF && user.getId() != id))
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
    @Transactional
    public User updateUser(int id, Map<String, String> params, MultipartFile avatar) {
        if (id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID người dùng không hợp lệ");
        }

        User u = this.userRepo.getUserById(id);
        if (u == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng");
        }

        if (params.containsKey("firstName")) {
            String firstName = params.get("firstName");
            if (firstName != null && !firstName.trim().isEmpty()) {
                u.setFirstName(firstName.trim());
            }
        }
        if (params.containsKey("lastName")) {
            String lastName = params.get("lastName");
            if (lastName != null && !lastName.trim().isEmpty()) {
                u.setLastName(lastName.trim());
            }
        }
        if (params.containsKey("phone")) {
            String phone = params.get("phone");
            if (phone != null && !phone.trim().isEmpty()) {
                u.setPhone(phone.trim());
            }
        }

        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map res = this.cloudinary.uploader().upload(avatar.getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));
                u.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi upload ảnh");
            }
        }
        this.userRepo.updateUser(u);
        return u;
    }

    @Override
    @Transactional
    public void approveUser(int id) {
        User u = this.userRepo.getUserById(id);
        if (u != null && u.getUserRole() == UserRole.ROLE_USER) {
            u.setUserRole(UserRole.ROLE_CHEF);
            u.setActive(true);
            this.userRepo.updateUser(u);
        }
    }
}
