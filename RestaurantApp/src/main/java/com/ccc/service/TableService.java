/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ccc.service;

import com.ccc.pojo.RestaurantTable;
import java.util.List;
import java.util.Map;
import com.ccc.dto.TableDto;

/**
 *
 * @author Admin
 */
public interface TableService {
    List<TableDto> getTables(Map<String, String> params);
    TableDto addTable(Map<String, String> params);
    TableDto updateTable(int id, Map<String, String> params);
    boolean deleteTable(int id);
}
