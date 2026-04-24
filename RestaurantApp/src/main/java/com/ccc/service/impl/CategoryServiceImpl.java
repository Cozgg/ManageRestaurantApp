/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.dto.CategoryDto;
import com.ccc.pojo.Category;
import com.ccc.repository.CategoryRepository;
import com.ccc.service.CategoryService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Admin
 */
@Service
public class CategoryServiceImpl implements CategoryService{
    
    @Autowired
    private CategoryRepository cateRepo;
    
    @Override
    public List<CategoryDto> getCates() {
        List<Category> list = this.cateRepo.getCates();
        
        return list.stream().map(c -> {
            CategoryDto dto = new CategoryDto();
            dto.setId(c.getId().intValue());
            dto.setName(c.getName());
            return dto;
        }).collect(Collectors.toList());
    }
    
}
