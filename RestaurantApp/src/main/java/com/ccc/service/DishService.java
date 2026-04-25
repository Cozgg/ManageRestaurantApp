/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service;

import com.ccc.dto.DishDto;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Admin
 */
public interface DishService {

    List<DishDto> getDishs(Map<String, String> params);
    DishDto getDishById(Integer id);
    DishDto addDish(Map<String, String> params, MultipartFile image) throws IOException;
    DishDto updateDish(Integer id, Map<String, String> params, MultipartFile image) throws IOException;
    boolean deleteDish(Integer id);
}
