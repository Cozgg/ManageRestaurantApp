/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ccc.repository;

import java.util.List;

import com.ccc.pojo.Rating;
import com.ccc.pojo.User;

/**
 *
 * @author Admin
 */
public interface RatingRepository {

    Rating addRating(Rating r);

    List<Rating> getRatingsByDishId(int dishId);

    Rating getRatingByUserAndDish(User user, int dishId);
}
