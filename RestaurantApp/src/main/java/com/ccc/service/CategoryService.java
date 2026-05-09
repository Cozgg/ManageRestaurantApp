/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service;

import com.ccc.dto.CategoryDto;
import com.ccc.pojo.Category;
import java.util.List;

/**
 *
 * @author Admin    
 */
public interface CategoryService {
    List<CategoryDto> getCates();
    CategoryDto addCategory(java.util.Map<String, String> params);
    CategoryDto updateCategory(int id, java.util.Map<String, String> params);
    boolean deleteCategory(int id);
}
