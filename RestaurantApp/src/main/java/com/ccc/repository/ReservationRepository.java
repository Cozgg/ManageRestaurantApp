/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ccc.repository;

import com.ccc.pojo.Reservation;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Admin
 */
public interface ReservationRepository {
    List<Reservation> getReservations(Map<String, String> params);
    void addOrUpdate(Reservation r);
    void delete(int id);
    Reservation getById(int id);
    List<Reservation> getReservationsByUserId(int userId);
    List<Reservation> getReservationsByTableId(int tableId);
    boolean hasTimeConflict(int tableId, Date startTime, Date endTime, Integer excludeReservationId);
}
