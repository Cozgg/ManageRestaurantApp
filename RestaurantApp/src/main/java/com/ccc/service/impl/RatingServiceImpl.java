/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ccc.pojo.Dish;
import com.ccc.pojo.Rating;
import com.ccc.pojo.User;
import com.ccc.repository.DishRepository;
import com.ccc.repository.RatingRepository;
import com.ccc.service.RatingService;

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
        if (!params.containsKey("dishId")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dish ID is required");
        }
        if (!params.containsKey("point")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Điểm đánh giá là bắt buộc");
        }

        int dishId = Integer.parseInt(params.get("dishId"));
        if (dishId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dish ID phải lớn hơn 0");
        }

        int point = Integer.parseInt(params.get("point"));
        if (point < 1 || point > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Điểm đánh giá phải từ 1 đến 5");
        }

        String content = params.get("content");
        if (content != null && content.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nội dung đánh giá không được để trống");
        }

        Dish dish = this.dishRepo.getDishById(dishId);
        if (dish == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy món ăn");
        }

        Rating r = new Rating();
        r.setPoint(point);
        r.setContent(content != null ? content.trim() : null);
        r.setCreatedAt(new Date());
        r.setUserId(user);
        r.setDishId(dish);

        return this.ratingRepo.addRating(r);
    }

    @Override
    public Rating updateRating(Map<String, String> params, User user) {
        if (!params.containsKey("dishId")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dish ID is required");
        }
        if (!params.containsKey("point")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Điểm đánh giá là bắt buộc");
        }

        int dishId = Integer.parseInt(params.get("dishId"));
        if (dishId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dish ID phải lớn hơn 0");
        }

        int point = Integer.parseInt(params.get("point"));
        if (point < 1 || point > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Điểm đánh giá phải từ 1 đến 5");
        }

        String content = params.get("content");
        if (content != null && content.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nội dung đánh giá không được để trống");
        }

        Rating existingRating = this.ratingRepo.getRatingByUserAndDish(user, dishId);
        if (existingRating == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bạn chưa đánh giá món này");
        }

        existingRating.setPoint(point);
        existingRating.setContent(content != null ? content.trim() : null);
        existingRating.setCreatedAt(new Date());

        return this.ratingRepo.updateRating(existingRating);
    }

    @Override
    public List<Rating> getRatingsByDishId(int dishId) {
        return this.ratingRepo.getRatingsByDishId(dishId);
    }

    @Override
    public Rating getRatingByUserAndDish(User user, int dishId) {
        return this.ratingRepo.getRatingByUserAndDish(user, dishId);
    }
}
