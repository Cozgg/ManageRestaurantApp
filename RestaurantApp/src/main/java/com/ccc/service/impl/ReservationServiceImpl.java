/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.dto.ReservationDto;
import com.ccc.pojo.Reservation;
import com.ccc.pojo.RestaurantTable;
import com.ccc.pojo.User;
import com.ccc.repository.ReservationRepository;
import com.ccc.repository.TableRepository;
import com.ccc.repository.UserRepository;
import com.ccc.service.ReservationService;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Admin
 */
@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepo;

    @Autowired
    private TableRepository tableRepo;

    @Autowired
    private UserRepository userRepo;

    private ReservationDto toDto(Reservation r) {
        return ReservationDto.builder()
                .id(r.getId())
                .startTime(r.getStartTime())
                .endTime(r.getEndTime())
                .numberPeople(r.getNumberPeople())
                .status(r.getStatus())
                .tableId(r.getTableId() != null ? r.getTableId().getId() : null)
                .tableNumber(r.getTableId() != null ? r.getTableId().getTableNumber() : null)
                .tableCapacity(r.getTableId() != null ? r.getTableId().getCapacity() : null)
                .tableLocation(r.getTableId() != null ? r.getTableId().getLocation() : null)
                .userId(r.getUserId() != null ? r.getUserId().getId() : null)
                .username(r.getUserId() != null ? r.getUserId().getUsername() : null)
                .userFirstName(r.getUserId() != null ? r.getUserId().getFirstName() : null)
                .userLastName(r.getUserId() != null ? r.getUserId().getLastName() : null)
                .createdAt(r.getCreatedAt())
                .build();
    }

    @Override
    public List<ReservationDto> getReservations(Map<String, String> params) {
        return this.reservationRepo.getReservations(params).stream().map(this::toDto).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public ReservationDto addReservation(Map<String, String> params) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
            
            Reservation r = new Reservation();
            r.setStartTime(params.containsKey("startTime") ? sdf.parse(params.get("startTime")) : new Date());
            r.setEndTime(params.containsKey("endTime") ? sdf.parse(params.get("endTime")) : new Date());
            r.setNumberPeople(Integer.parseInt(params.getOrDefault("numberPeople", "1")));
            r.setStatus(params.getOrDefault("status", "PENDING"));
            r.setCreatedAt(new Date());

            if (params.containsKey("tableId")) {
                RestaurantTable table = this.tableRepo.getById(Integer.parseInt(params.get("tableId")));
                r.setTableId(table);
            }

            if (params.containsKey("userId")) {
                User user = this.userRepo.getUserById(Integer.parseInt(params.get("userId")));
                r.setUserId(user);
            }

            this.reservationRepo.addOrUpdate(r);
            return toDto(r);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public ReservationDto updateReservation(int id, Map<String, String> params) {
        Reservation r = this.reservationRepo.getById(id);
        if (r != null) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
                
                if (params.containsKey("startTime")) r.setStartTime(sdf.parse(params.get("startTime")));
                if (params.containsKey("endTime")) r.setEndTime(sdf.parse(params.get("endTime")));
                if (params.containsKey("numberPeople")) r.setNumberPeople(Integer.parseInt(params.get("numberPeople")));
                if (params.containsKey("status")) r.setStatus(params.get("status"));
                
                if (params.containsKey("tableId")) {
                    RestaurantTable table = this.tableRepo.getById(Integer.parseInt(params.get("tableId")));
                    r.setTableId(table);
                }

                this.reservationRepo.addOrUpdate(r);
                return toDto(r);
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
        return null;
    }

    @Override
    public boolean deleteReservation(int id) {
        try {
            this.reservationRepo.delete(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public ReservationDto getReservationById(int id) {
        Reservation r = this.reservationRepo.getById(id);
        return r != null ? toDto(r) : null;
    }

    @Override
    public List<ReservationDto> getReservationsByUserId(int userId) {
        return this.reservationRepo.getReservationsByUserId(userId).stream().map(this::toDto).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<ReservationDto> getReservationsByTableId(int tableId) {
        return this.reservationRepo.getReservationsByTableId(tableId).stream().map(this::toDto).collect(java.util.stream.Collectors.toList());
    }
}
