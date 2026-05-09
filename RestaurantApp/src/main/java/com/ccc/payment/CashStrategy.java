/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.payment;

import org.springframework.stereotype.Component;

/**
 *
 * @author Admin
 */
@Component("CASH")
public class CashStrategy implements PaymentStrategy{

    @Override
    public String pay(String orderId, long amount) {
        return orderId;
    }
    
}
