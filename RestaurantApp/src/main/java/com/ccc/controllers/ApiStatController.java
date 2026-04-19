/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.service.StatService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@RequestMapping("/api")
public class ApiStatController {
    
    @Autowired
    private StatService statService;
    
    
    @GetMapping("/stat-revenue")
    public ResponseEntity<List<Object[]>> statRevenuebyTime(@RequestParam(value="time", defaultValue = "MONTH") String time, 
            @RequestParam(value="year", defaultValue = "2026") int year){
        List<Object[]> data = this.statService.statsRevenueByTime(time, year);
        return ResponseEntity.ok(data);
    }
    
}
