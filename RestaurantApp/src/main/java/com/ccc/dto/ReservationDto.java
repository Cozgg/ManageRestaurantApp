/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author Admin
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    private Integer id;
    private Date startTime;
    private Date endTime;
    private Integer numberPeople;
    private String status;
    private Integer tableId;
    private String tableNumber;
    private Integer tableCapacity;
    private String tableLocation;
    private Integer userId;
    private String username;
    private String userFirstName;
    private String userLastName;
    private Date createdAt;
}
