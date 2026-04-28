/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.dto.DishDto;
import com.ccc.dto.UserDto;
import com.ccc.pojo.Dish;
import com.ccc.repository.DishRepository;
import com.ccc.service.DishService;
import com.cloudinary.Cloudinary;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Admin
 */
@Service
public class DishServiceImpl implements DishService{
    
    @Autowired
    private DishRepository dishRepo;
    
    @Autowired
    private Cloudinary cloudinary;
    
    
    @Override
    public List<DishDto> getDishs(Map<String, String> params) {
        List<Dish> dishes = this.dishRepo.getDishs(params);
        return dishes.stream().map(d ->{
            DishDto dish = new DishDto();
            dish.setId(d.getId());
            dish.setName(d.getName());
            dish.setDescription(d.getDescription());
            dish.setImage(d.getImage());
            dish.setTimePrepare(d.getTimePrepare());
            dish.setMaterial(d.getMaterial());
            dish.setPrice(d.getPrice());
            dish.setCategoryId(d.getCategoryId().getId());
            UserDto u = new UserDto();
            u.setFirstName(d.getUserId().getFirstName());
            u.setLastName(d.getUserId().getLastName());
            dish.setUser(u);
            return dish;
        }).collect(Collectors.toList());
    }
    
}
