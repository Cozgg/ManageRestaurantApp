/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 *
 * @author Admin
 */
@Entity
@Table(name = "restaurant_table")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"reservationSet"})
@NamedQueries({
    @NamedQuery(name = "RestaurantTable.findAll", query = "SELECT r FROM RestaurantTable r"),
    @NamedQuery(name = "RestaurantTable.findById", query = "SELECT r FROM RestaurantTable r WHERE r.id = :id"),
    @NamedQuery(name = "RestaurantTable.findByCapacity", query = "SELECT r FROM RestaurantTable r WHERE r.capacity = :capacity"),
    @NamedQuery(name = "RestaurantTable.findByTableNumber", query = "SELECT r FROM RestaurantTable r WHERE r.tableNumber = :tableNumber")})
public class RestaurantTable implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 10)
    @Column(name = "table_number")
    private String tableNumber;
    @Size(max = 100)
    @Column(name = "location")
    private String location;

    @Column(name = "active")
    private Boolean active = true;

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    @EqualsAndHashCode.Include
    private Integer id;
    @Column(name = "capacity")
    private Integer capacity;
    @JsonIgnore
    @OneToMany(mappedBy = "tableId")
    private Set<Reservation> reservationSet;

}
