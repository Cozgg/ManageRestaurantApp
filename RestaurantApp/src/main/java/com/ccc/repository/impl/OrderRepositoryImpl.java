/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository.impl;

import com.ccc.pojo.Dish;
import com.ccc.pojo.OrderDetail;
import com.ccc.pojo.OrderItem;
import com.ccc.pojo.Orders;
import com.ccc.pojo.User;
import com.ccc.pojo.UserRole;
import com.ccc.repository.OrderRepository;
import com.ccc.repository.UserRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Admin
 */
@Repository
@Transactional
public class OrderRepositoryImpl implements OrderRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private UserRepository userRepo;

    @Override
    public void addOrder(List<OrderItem> items) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public List<Orders> getOrders() {
        Session s = this.factory.getObject().getCurrentSession();
        System.out.println(SecurityContextHolder.getContext().getAuthentication().getName());
        User u = userRepo.getUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Orders> cq = b.createQuery(Orders.class);
        Root root = cq.from(Orders.class);
        if (u.getUserRole() == UserRole.ROLE_ADMIN) {
            cq.select(root);
        } else if (u.getUserRole() == UserRole.ROLE_CHEF) {
            Join<Orders, OrderDetail> orderJoin = root.join("orderDetailSet", JoinType.INNER);
            Join<OrderDetail, Dish> dishJoin = orderJoin.join("dishId", JoinType.INNER);
            
            cq.select(root).distinct(true).where(b.equal(dishJoin.get("userId").get("id"), u.getId()));
        }
        
        Query q = s.createQuery(cq);
        return q.getResultList();
    }

    @Override
    public Orders getOrderById(int orderId) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.get(Orders.class, orderId);
    }

}
