/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ccc.service;

import java.util.List;
import java.util.Map;

import com.ccc.pojo.Rating;
import com.ccc.pojo.User;

/**
 *
 * @author Admin
 */
public interface RatingService {

    Rating addRating(Map<String, String> params, User user);

    Rating updateRating(Map<String, String> params, User user);

    List<Rating> getRatingsByDishId(int dishId);

    Rating getRatingByUserAndDish(User user, int dishId);
}
