/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.repository.StatRepository;
import com.ccc.service.StatService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Admin
 */
@Service
public class StatServiceImpl implements StatService {
    
    @Autowired
    private StatRepository statRepo;
    
    @Override
    public List<Object[]> statsRevenueByTime(String time, int year) {
        return this.statRepo.statsRevenueByTime(time, year);
    }
}
