/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ccc.service;

import com.ccc.dto.ReservationDto;
import com.ccc.dto.TableDto;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Admin
 */
public interface ReservationService {
    List<ReservationDto> getReservations(Map<String, String> params);
    ReservationDto addReservation(Map<String, String> params);
    ReservationDto updateReservation(int id, Map<String, String> params);
    boolean deleteReservation(int id);
    ReservationDto getReservationById(int id);
    List<ReservationDto> getReservationsByUserId(int userId);
    List<ReservationDto> getReservationsByTableId(int tableId);
    List<TableDto> getAvailableTables(String startTime, String endTime);
    ReservationDto createWalkInReservation(Map<String, String> params);
}
