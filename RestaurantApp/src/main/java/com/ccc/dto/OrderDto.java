/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.dto;

import com.ccc.payment.PaymentMethod;
import java.util.Date;

/**
 *
 * @author Admin
 */
public class OrderDto {
    private int id;
    private int userId;
    private int reservationId;
    private Date createdDate;
    private String payment;
    private int totalPrice;
    private String statusPay;
    private String statusOrder;

    public OrderDto() {
    }
    
    

    public OrderDto(int id, int userId, int reservationId, Date createdDate, String payment, int totalPrice, String statusPay, String statusOrder) {
        this.id = id;
        this.userId = userId;
        this.reservationId = reservationId;
        this.createdDate = createdDate;
        this.payment = payment;
        this.totalPrice = totalPrice;
        this.statusPay = statusPay;
        this.statusOrder = statusOrder;
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the userId
     */
    public int getUserId() {
        return userId;
    }

    /**
     * @param userId the userId to set
     */
    public void setUserId(int userId) {
        this.userId = userId;
    }

    /**
     * @return the reservationId
     */
    public int getReservationId() {
        return reservationId;
    }

    /**
     * @param reservationId the reservationId to set
     */
    public void setReservationId(int reservationId) {
        this.reservationId = reservationId;
    }

    /**
     * @return the createdDate
     */
    public Date getCreatedDate() {
        return createdDate;
    }

    /**
     * @param createdDate the createdDate to set
     */
    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    /**
     * @return the payment
     */
    public String getPayment() {
        return payment;
    }

    /**
     * @param payment the payment to set
     */
    public void setPayment(String payment) {
        this.payment = payment;
    }

    /**
     * @return the totalPrice
     */
    public int getTotalPrice() {
        return totalPrice;
    }

    /**
     * @param totalPrice the totalPrice to set
     */
    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }

    /**
     * @return the statusPay
     */
    public String getStatusPay() {
        return statusPay;
    }

    /**
     * @param statusPay the statusPay to set
     */
    public void setStatusPay(String statusPay) {
        this.statusPay = statusPay;
    }

    /**
     * @return the statusOrder
     */
    public String getStatusOrder() {
        return statusOrder;
    }

    /**
     * @param statusOrder the statusOrder to set
     */
    public void setStatusOrder(String statusOrder) {
        this.statusOrder = statusOrder;
    }
    
}
