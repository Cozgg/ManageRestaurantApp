/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.dto;

import com.ccc.enums.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderDto {
    private Integer id;
    private Integer userId;
    private Integer reservationId;
    private Date createdDate;
    private String payment;
    private Integer totalPrice;
    private String statusPay;
    private String transactionId;
}
