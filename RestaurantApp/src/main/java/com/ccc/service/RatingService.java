/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ccc.service;

import com.ccc.pojo.Rating;
import com.ccc.pojo.User;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Admin
 */
public interface RatingService {
    Rating addRating(Map<String, String> params, User user);
    List<Rating> getRatingsByDishId(int dishId);
}
