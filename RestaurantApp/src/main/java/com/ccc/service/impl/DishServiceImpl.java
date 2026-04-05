/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.pojo.Dish;
import com.ccc.repository.DishRepository;
import com.ccc.service.DishService;
import com.cloudinary.Cloudinary;
import java.util.List;
import java.util.Map;
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
    public List<Dish> getDishs(Map<String, String> params) {
        return this.dishRepo.getDishs(params);
    }
    
}
