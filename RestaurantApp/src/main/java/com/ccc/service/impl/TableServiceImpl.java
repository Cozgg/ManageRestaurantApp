/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.dto.TableDto;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ccc.pojo.RestaurantTable;
import com.ccc.repository.TableRepository;
import com.ccc.service.TableService;

/**
 *
 * @author Admin
 */
@Service
public class TableServiceImpl implements TableService {

    @Autowired
    private TableRepository tableRepo;

    private TableDto toDto(RestaurantTable t) {
        return TableDto.builder()
                .id(t.getId())
                .tableNumber(t.getTableNumber())
                .capacity(t.getCapacity())
                .location(t.getLocation())
                .active(t.getActive())
                .build();
    }

    @Override
    public List<TableDto> getTables(Map<String, String> params) {
        return this.tableRepo.getTables(params).stream().map(this::toDto).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public TableDto addTable(Map<String, String> params) {
        RestaurantTable t = RestaurantTable.builder()
                .tableNumber(params.get("tableNumber"))
                .capacity(Integer.valueOf(params.getOrDefault("capacity", "0")))
                .location(params.get("location"))
                .active(true)
                .build();
        this.tableRepo.addOrUpdate(t);
        return toDto(t);
    }

    @Override
    public TableDto updateTable(int id, Map<String, String> params) {
        RestaurantTable t = this.tableRepo.getById(id);
        if (t != null) {
            if (params.containsKey("tableNumber")) {
                t.setTableNumber(params.get("tableNumber"));
            }
            if (params.containsKey("capacity")) {
                t.setCapacity(Integer.valueOf(params.get("capacity")));
            }
            if (params.containsKey("location")) {
                t.setLocation(params.get("location"));
            }
            if (params.containsKey("active")) {
                t.setActive(Boolean.valueOf(params.get("active")));
            }
            this.tableRepo.addOrUpdate(t);
            return toDto(t);
        }
        return null;
    }

    @Override
    public boolean deleteTable(int id) {
        try {
            this.tableRepo.delete(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public long countTables(Map<String, String> params) {
        return this.tableRepo.countTables(params);
    }
}
