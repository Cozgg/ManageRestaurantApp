/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.payment;

/**
 *
 * @author Admin
 */
public class CashStrategy implements PaymentStrategy{

    @Override
    public PaymentMethod pay() {
        return PaymentMethod.CASH;
    }
    
}
