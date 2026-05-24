/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.controllers;

import com.ccc.dto.ReservationDto;
import com.ccc.dto.TableDto;
import com.ccc.service.ReservationService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Admin
 */
@RestController
@RequestMapping("/api")
public class ApiReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/secure/reservations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReservationDto>> list(@RequestParam Map<String, String> params) {
        return new ResponseEntity<>(this.reservationService.getReservations(params), HttpStatus.OK);
    }

    @GetMapping("/secure/reservations/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationDto> getReservation(@PathVariable int id) {
        ReservationDto r = this.reservationService.getReservationById(id);
        if (r != null) {
            return new ResponseEntity<>(r, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/secure/reservations/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReservationDto>> getReservationsByUser(@PathVariable int userId) {
        return new ResponseEntity<>(this.reservationService.getReservationsByUserId(userId), HttpStatus.OK);
    }

    @GetMapping("/secure/reservations/table/{tableId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDto>> getReservationsByTable(@PathVariable int tableId) {
        return new ResponseEntity<>(this.reservationService.getReservationsByTableId(tableId), HttpStatus.OK);
    }

    @PostMapping("/secure/reservations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationDto> add(@RequestBody Map<String, String> params) {
        ReservationDto r = this.reservationService.addReservation(params);
        if (r != null) {
            return new ResponseEntity<>(r, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/secure/reservations/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationDto> update(@PathVariable int id, @RequestBody Map<String, String> params) {
        ReservationDto r = this.reservationService.updateReservation(id, params);
        if (r != null) {
            return new ResponseEntity<>(r, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/secure/reservations/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        if (this.reservationService.deleteReservation(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/available-tables")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TableDto>> getAvailableTables(@RequestParam String startTime, @RequestParam String endTime) {
        return new ResponseEntity<>(this.reservationService.getAvailableTables(startTime, endTime), HttpStatus.OK);
    }

    @PostMapping("/walk-in")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationDto> createWalkIn(@RequestBody Map<String, String> params) {
        try {
            ReservationDto r = this.reservationService.createWalkInReservation(params);
            if (r != null) {
                return new ResponseEntity<>(r, HttpStatus.CREATED);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
