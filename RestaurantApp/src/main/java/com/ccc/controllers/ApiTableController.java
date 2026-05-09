/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.pojo.RestaurantTable;
import com.ccc.service.TableService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@RequestMapping("/api")
public class ApiTableController {

    @Autowired
    private TableService tableService;

    @GetMapping("/tables")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RestaurantTable>> list(@RequestParam Map<String, String> params) {
        return new ResponseEntity<>(this.tableService.getTables(params), HttpStatus.OK);
    }

    @PostMapping("/tables")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.ccc.dto.TableDto> add(@RequestParam Map<String, String> params) {
        return new ResponseEntity<>(this.tableService.addTable(params), HttpStatus.CREATED);
    }

    @PatchMapping("/tables/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.ccc.dto.TableDto> update(@PathVariable int id, @RequestParam Map<String, String> params) {
        return new ResponseEntity<>(this.tableService.updateTable(id, params), HttpStatus.OK);
    }

    @DeleteMapping("/tables/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
