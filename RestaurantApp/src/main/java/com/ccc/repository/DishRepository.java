/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository;

import com.ccc.pojo.Dish;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Admin
 */
public interface DishRepository {
    List<Dish> getDishs(Map<String, String> params);
    Dish getDishById(int id);
}
