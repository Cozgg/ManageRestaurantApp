/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.ccc.dto.DishDto;
import com.ccc.dto.UserDto;
import com.ccc.pojo.Category;
import com.ccc.pojo.Dish;
import com.ccc.pojo.User;
import com.ccc.repository.DishRepository;
import com.ccc.service.DishService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

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
            u.setId(d.getUserId().getId());
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
    public List<DishDto> getDishs(Map<String, String> params, User currentChef) {
        if (currentChef == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đầu bếp hiện tại");
        }
        return this.dishRepo.getDishs(params, currentChef)
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
    public DishDto addDish(Map<String, String> params, MultipartFile image, User chef) throws IOException {
        String name = params.get("name");
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên món ăn không được để trống");
        }

        String priceStr = params.get("price");
        if (priceStr == null || priceStr.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giá bán không được để trống");
        }
        int price = Integer.parseInt(priceStr);
        if (price <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giá bán phải lớn hơn 0");
        }

        String timePrepareStr = params.get("timePrepare");
        if (timePrepareStr == null || timePrepareStr.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian nấu không được để trống");
        }
        int timePrepare = Integer.parseInt(timePrepareStr);
        if (timePrepare <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian nấu phải lớn hơn 0");
        }

        String categoryIdStr = params.get("categoryId");
        if (categoryIdStr == null || categoryIdStr.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh mục không được để trống");
        }

        String material = params.get("material");
        if (material == null || material.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nguyên liệu không được để trống");
        }

        String description = params.get("description");
        if (description == null || description.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mô tả không được để trống");
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = uploadImage(image);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hình ảnh không được để trống");
        }

        Dish dish = Dish.builder()
                .userId(chef)
                .name(name.trim())
                .price(price)
                .description(description.trim())
                .active(true)
                .timePrepare(timePrepare)
                .material(material.trim())
                .image(imageUrl)
                .build();
        Category category = new Category();
        category.setId(Integer.valueOf(categoryIdStr));
        dish.setCategoryId(category);

        this.dishRepo.saveDish(dish);
        return toDto(dish);
    }

    @Override
    public DishDto updateDish(Integer id, Map<String, String> params, MultipartFile image) throws IOException {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID món ăn không hợp lệ");
        }

        Dish dish = this.dishRepo.getDishById(id);
        if (dish == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy món ăn");
        }

        String name = params.get("name");
        if (name != null && !name.trim().isEmpty()) {
            dish.setName(name.trim());
        }

        String description = params.get("description");
        if (description != null && !description.trim().isEmpty()) {
            dish.setDescription(description.trim());
        }

        String material = params.get("material");
        if (material != null && !material.trim().isEmpty()) {
            dish.setMaterial(material.trim());
        }

        String priceStr = params.get("price");
        if (priceStr != null && !priceStr.trim().isEmpty()) {
            int price = Integer.parseInt(priceStr);
            if (price <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giá bán phải lớn hơn 0");
            }
            dish.setPrice(price);
        }

        String timePrepareStr = params.get("timePrepare");
        if (timePrepareStr != null && !timePrepareStr.trim().isEmpty()) {
            int timePrepare = Integer.parseInt(timePrepareStr);
            if (timePrepare <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thời gian nấu phải lớn hơn 0");
            }
            dish.setTimePrepare(timePrepare);
        }

        String categoryIdStr = params.get("categoryId");
        if (categoryIdStr != null && !categoryIdStr.trim().isEmpty()) {
            Category category = new Category();
            category.setId(Integer.valueOf(categoryIdStr));
            dish.setCategoryId(category);
        }

        if (image != null && !image.isEmpty()) {
            dish.setImage(uploadImage(image));
        }

        this.dishRepo.updateDish(dish);
        return toDto(dish);
    }

    @Override
    public boolean deleteDish(Integer id) {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID món ăn không hợp lệ");
        }

        Dish dish = this.dishRepo.getDishById(id);
        if (dish == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy món ăn");
        }
        dish.setActive(false);
        this.dishRepo.updateDish(dish);
        return true;
    }

}
