/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.dto;

import java.util.List;

import com.ccc.enums.PaymentMethod;
import com.ccc.pojo.OrderItem;

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
public class ItemDto {

    private List<OrderItem> items;
    private PaymentMethod paymentMethod;
    private int totalAmount;

    public int calculateTotalAmount() {
        return this.items.stream().mapToInt(i -> i.getPrice() * i.getQuantity()).sum();
    }
}
