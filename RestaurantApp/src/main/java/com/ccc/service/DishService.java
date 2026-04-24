/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service;

import com.ccc.dto.DishDto;
import com.ccc.pojo.Dish;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Admin
 */
public interface DishService {
    List<DishDto> getDishs(Map<String, String> params);
}
