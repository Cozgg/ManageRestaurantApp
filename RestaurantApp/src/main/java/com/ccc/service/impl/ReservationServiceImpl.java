/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.service.impl;

import com.ccc.dto.ReservationDto;
import com.ccc.dto.TableDto;
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
            
            if (!params.containsKey("tableId")) {
                throw new IllegalArgumentException("Table ID is required");
            }
            
            RestaurantTable table = this.tableRepo.getById(Integer.parseInt(params.get("tableId")));
            if (table == null) {
                throw new IllegalArgumentException("Table not found");
            }
            
            int numberPeople = Integer.parseInt(params.getOrDefault("numberPeople", "1"));
            if (numberPeople > table.getCapacity()) {
                throw new IllegalArgumentException("Số người vượt quá sức chứa của bàn (" + table.getCapacity() + " người)");
            }
            
            Date startTime = params.containsKey("startTime") ? sdf.parse(params.get("startTime")) : new Date();
            Date endTime = params.containsKey("endTime") ? sdf.parse(params.get("endTime")) : new Date();
            
            if (startTime.after(endTime)) {
                throw new IllegalArgumentException("Thời gian kết thúc phải sau thời gian bắt đầu");
            }
            
            if (this.reservationRepo.hasTimeConflict(table.getId(), startTime, endTime, null)) {
                throw new IllegalArgumentException("Bàn này đã được đặt trong khoảng thời gian đã chọn");
            }
            
            Reservation r = new Reservation();
            r.setStartTime(startTime);
            r.setEndTime(endTime);
            r.setNumberPeople(numberPeople);
            r.setStatus(params.getOrDefault("status", "PENDING"));
            r.setCreatedAt(new Date());
            r.setTableId(table);

            if (params.containsKey("userId")) {
                User user = this.userRepo.getUserById(Integer.parseInt(params.get("userId")));
                r.setUserId(user);
            }

            this.reservationRepo.addOrUpdate(r);
            return toDto(r);
        } catch (IllegalArgumentException e) {
            throw e;
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
                
                Date startTime = r.getStartTime();
                Date endTime = r.getEndTime();
                RestaurantTable table = r.getTableId();
                
                if (params.containsKey("startTime")) startTime = sdf.parse(params.get("startTime"));
                if (params.containsKey("endTime")) endTime = sdf.parse(params.get("endTime"));
                
                if (startTime.after(endTime)) {
                    throw new IllegalArgumentException("Thời gian kết thúc phải sau thời gian bắt đầu");
                }
                
                if (params.containsKey("tableId")) {
                    table = this.tableRepo.getById(Integer.parseInt(params.get("tableId")));
                    if (table == null) {
                        throw new IllegalArgumentException("Table not found");
                    }
                }
                
                if (params.containsKey("numberPeople")) {
                    int numberPeople = Integer.parseInt(params.get("numberPeople"));
                    if (numberPeople > table.getCapacity()) {
                        throw new IllegalArgumentException("Số người vượt quá sức chứa của bàn (" + table.getCapacity() + " người)");
                    }
                    r.setNumberPeople(numberPeople);
                }
                
                if (this.reservationRepo.hasTimeConflict(table.getId(), startTime, endTime, id)) {
                    throw new IllegalArgumentException("Bàn này đã được đặt trong khoảng thời gian đã chọn");
                }
                
                r.setStartTime(startTime);
                r.setEndTime(endTime);
                
                // Use State Pattern for status transitions
                if (params.containsKey("status")) {
                    String newStatus = params.get("status");
                    switch (newStatus) {
                        case "CONFIRMED":
                            r.confirm();
                            break;
                        case "CANCELLED":
                            r.cancel();
                            break;
                        case "COMPLETED":
                            r.complete();
                            break;
                        case "OCCUPIED":
                            r.setStatus("OCCUPIED");
                            r.setState(new com.ccc.states.impl.OccupiedState());
                            break;
                        default:
                            r.setStatus(newStatus);
                    }
                }
                
                r.setTableId(table);

                this.reservationRepo.addOrUpdate(r);
                return toDto(r);
            } catch (IllegalArgumentException e) {
                throw e;
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

    @Override
    public List<TableDto> getAvailableTables(String startTime, String endTime) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
            Date start = sdf.parse(startTime);
            Date end = sdf.parse(endTime);
            
            List<Reservation> allReservations = this.reservationRepo.getReservations(new java.util.HashMap<>());
            List<com.ccc.dto.TableDto> availableTables = new java.util.ArrayList<>();
            
            Map<String, String> tableParams = new java.util.HashMap<>();
            tableParams.put("active", "true");
            List<RestaurantTable> allTables = this.tableRepo.getTables(tableParams);
            
            for (RestaurantTable table : allTables) {
                boolean isAvailable = true;
                
                for (Reservation r : allReservations) {
                    if (r.getTableId().getId() != table.getId()) {
                        continue;
                    }
                    
                    if (r.getStatus().equals("CANCELLED") || r.getStatus().equals("COMPLETED")) {
                        continue;
                    }
                    
                    Date rStart = r.getStartTime();
                    Date rEnd = r.getEndTime();
                    
                    if (!(start.after(rEnd) || end.before(rStart))) {
                        isAvailable = false;
                        break;
                    }
                }
                
                if (isAvailable) {
                    com.ccc.dto.TableDto dto = new com.ccc.dto.TableDto();
                    dto.setId(table.getId());
                    dto.setTableNumber(table.getTableNumber());
                    dto.setCapacity(table.getCapacity());
                    dto.setLocation(table.getLocation());
                    dto.setActive(table.getActive());
                    availableTables.add(dto);
                }
            }
            
            return availableTables;
        } catch (Exception e) {
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }

    @Override
    public ReservationDto createWalkInReservation(Map<String, String> params) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
            
            if (!params.containsKey("tableId")) {
                throw new IllegalArgumentException("Table ID is required");
            }
            
            RestaurantTable table = this.tableRepo.getById(Integer.parseInt(params.get("tableId")));
            if (table == null) {
                throw new IllegalArgumentException("Table not found");
            }
            
            int numberPeople = Integer.parseInt(params.getOrDefault("numberPeople", "1"));
            if (numberPeople > table.getCapacity()) {
                throw new IllegalArgumentException("Số người vượt quá sức chứa của bàn (" + table.getCapacity() + " người)");
            }
            
            Date startTime = new Date();
            Date endTime = new Date(System.currentTimeMillis() + 2 * 60 * 60 * 1000);
            
            if (this.reservationRepo.hasTimeConflict(table.getId(), startTime, endTime, null)) {
                throw new IllegalArgumentException("Bàn này đang có khách");
            }
            
            Reservation r = new Reservation();
            r.setStartTime(startTime);
            r.setEndTime(endTime);
            r.setNumberPeople(numberPeople);
            r.setStatus("OCCUPIED");
            r.setCreatedAt(new Date());
            r.setTableId(table);
            
            if (params.containsKey("customerName")) {
                r.setCustomerName(params.get("customerName"));
            }

            this.reservationRepo.addOrUpdate(r);
            return toDto(r);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
