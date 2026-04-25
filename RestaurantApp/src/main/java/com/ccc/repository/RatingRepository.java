/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ccc.repository;

import com.ccc.pojo.Rating;
import java.util.List;

/**
 *
 * @author Admin
 */
public interface RatingRepository {
    Rating addRating(Rating r);
    List<Rating> getRatingsByDishId(int dishId);
}
