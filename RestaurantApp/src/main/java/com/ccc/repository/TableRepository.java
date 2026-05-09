/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ccc.repository;

import com.ccc.pojo.RestaurantTable;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Admin
 */
public interface TableRepository {
    List<RestaurantTable> getTables(Map<String, String> params);
    void addOrUpdate(RestaurantTable t);
    void delete(int id);
    RestaurantTable getById(int id);
}
