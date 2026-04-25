/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.pojo.Dish;
import com.ccc.pojo.Rating;
import com.ccc.pojo.User;
import com.ccc.repository.DishRepository;
import com.ccc.repository.RatingRepository;
import com.ccc.service.RatingService;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Admin
 */
@Service
public class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepo;
    
    @Autowired
    private DishRepository dishRepo;

    @Override
    public Rating addRating(Map<String, String> params, User user) {
        Rating r = new Rating();
        r.setPoint(Integer.parseInt(params.get("point")));
        r.setContent(params.get("content"));
        r.setCreatedAt(new Date());
        r.setUserId(user);
        
        int dishId = Integer.parseInt(params.get("dishId"));
        Dish dish = this.dishRepo.getDishById(dishId);
        r.setDishId(dish);
        
        return this.ratingRepo.addRating(r);
    }

    @Override
    public List<Rating> getRatingsByDishId(int dishId) {
        return this.ratingRepo.getRatingsByDishId(dishId);
    }
}
