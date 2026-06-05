/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.pojo;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author Admin
 */
@Entity
@Table(name = "reservation")
@NamedQueries({
    @NamedQuery(name = "Reservation.findAll", query = "SELECT r FROM Reservation r"),
    @NamedQuery(name = "Reservation.findById", query = "SELECT r FROM Reservation r WHERE r.id = :id"),
    @NamedQuery(name = "Reservation.findByStartTime", query = "SELECT r FROM Reservation r WHERE r.startTime = :startTime"),
    @NamedQuery(name = "Reservation.findByEndTime", query = "SELECT r FROM Reservation r WHERE r.endTime = :endTime"),
    @NamedQuery(name = "Reservation.findByCreatedAt", query = "SELECT r FROM Reservation r WHERE r.createdAt = :createdAt"),
    @NamedQuery(name = "Reservation.findByNumberPeople", query = "SELECT r FROM Reservation r WHERE r.numberPeople = :numberPeople"),
    @NamedQuery(name = "Reservation.findByStatus", query = "SELECT r FROM Reservation r WHERE r.status = :status")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Reservation implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "number_people")
    private int numberPeople;
    @Size(max = 9)
    @Column(name = "status")
    private String status;
    @Size(max = 100)
    @Column(name = "customer_name")
    private String customerName;

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    @EqualsAndHashCode.Include
    private Integer id;
    @Column(name = "start_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;
    @Column(name = "end_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @JoinColumn(name = "table_id", referencedColumnName = "id")
    @ManyToOne
    private RestaurantTable tableId;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @ManyToOne
    private User userId;

}
