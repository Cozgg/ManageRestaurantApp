/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.dto.DishDto;
import com.ccc.dto.UserDto;
import com.ccc.pojo.Category;
import com.ccc.pojo.Dish;
import com.ccc.pojo.User;
import com.ccc.repository.DishRepository;
import com.ccc.service.DishService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Admin
 */
@Service
public class DishServiceImpl implements DishService {

    @Autowired
    private DishRepository dishRepo;

    @Autowired
    private Cloudinary cloudinary;

    private DishDto toDto(Dish d) {
        DishDto dto = new DishDto();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setDescription(d.getDescription());
        dto.setImage(d.getImage());
        dto.setTimePrepare(d.getTimePrepare());
        dto.setMaterial(d.getMaterial());
        dto.setPrice(d.getPrice());
        if (d.getCategoryId() != null) {
            dto.setCategoryId(d.getCategoryId().getId());
        }
        if (d.getUserId() != null) {
            UserDto u = new UserDto();
            u.setFirstName(d.getUserId().getFirstName());
            u.setLastName(d.getUserId().getLastName());
            dto.setUser(u);
        }
        return dto;
    }

    private String uploadImage(MultipartFile image) throws IOException {
        Map uploadResult = this.cloudinary.uploader().upload(
                image.getBytes(),
                ObjectUtils.asMap("folder", "dishes")
        );
        return (String) uploadResult.get("secure_url");
    }

    @Override
    public List<DishDto> getDishs(Map<String, String> params) {
        return this.dishRepo.getDishs(params)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DishDto getDishById(Integer id) {
        Dish dish = this.dishRepo.getDishById(id);
        if (dish == null) {
            return null;
        }
        return toDto(dish);
    }

    @Override
    public DishDto addDish(Map<String, String> params, MultipartFile image) throws IOException {
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = uploadImage(image);
        }

        Dish dish = Dish.builder()
                .name(params.get("name"))
                .price(Integer.parseInt(params.get("price")))
                .description(params.get("description"))
                .active(true)
                .timePrepare(Integer.parseInt(params.getOrDefault("timePrepare", "0")))
                .material(params.get("material"))
                .image(imageUrl)
                .build();
        String categoryIdStr = params.get("categoryId");
        if (categoryIdStr != null && !categoryIdStr.isEmpty()) {
            Category category = new Category();
            category.setId(Integer.parseInt(categoryIdStr));
            dish.setCategoryId(category);
        }

        String userIdStr = params.get("userId");
        if (userIdStr != null && !userIdStr.isEmpty()) {
            User user = new User();
            user.setId(Integer.parseInt(userIdStr));
            dish.setUserId(user);
        }

        this.dishRepo.saveDish(dish);
        return toDto(dish);
    }

    @Override
    public DishDto updateDish(Integer id, Map<String, String> params, MultipartFile image) throws IOException {
        Dish dish = this.dishRepo.getDishById(id);
        if (dish == null) {
            return null;
        }

        String name = params.get("name");
        if (name != null && !name.isEmpty()) {
            dish.setName(name);
        }

        String description = params.get("description");
        if (description != null && !description.isEmpty()) {
            dish.setDescription(description);
        }

        String material = params.get("material");
        if (material != null && !material.isEmpty()) {
            dish.setMaterial(material);
        }

        String priceStr = params.get("price");
        if (priceStr != null && !priceStr.isEmpty()) {
            dish.setPrice(Integer.parseInt(priceStr));
        }

        String timePrepareStr = params.get("timePrepare");
        if (timePrepareStr != null && !timePrepareStr.isEmpty()) {
            dish.setTimePrepare(Integer.parseInt(timePrepareStr));
        }

        String categoryIdStr = params.get("categoryId");
        if (categoryIdStr != null && !categoryIdStr.isEmpty()) {
            Category category = new Category();
            category.setId(Integer.parseInt(categoryIdStr));
            dish.setCategoryId(category);
        }

        // Cập nhật ảnh nếu có file mới
        if (image != null && !image.isEmpty()) {
            dish.setImage(uploadImage(image));
        }

        this.dishRepo.updateDish(dish);
        return toDto(dish);
    }

    @Override
    public boolean deleteDish(Integer id) {
        Dish dish = this.dishRepo.getDishById(id);
        if (dish == null) {
            return false;
        }
        this.dishRepo.deleteDish(id);
        return true;
    }
}
