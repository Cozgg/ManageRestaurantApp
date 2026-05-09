/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service;

import java.util.List;

/**
 *
 * @author Admin
 */
public interface StatService {
    List<Object[]> statsRevenueByTime(String time, int year);
    List<Object[]> statsTopDishes(int top);
    List<Object[]> statsReservationsByTime(String time, int year);
}
