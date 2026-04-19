/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository.impl;

import com.ccc.pojo.OrderDetail;
import com.ccc.pojo.Orders;
import com.ccc.repository.StatRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Admin
 */
@Repository
@Transactional
public class StatRepositoryImpl implements StatRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Object[]> statsRevenueByTime(String time, int year) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        Root root = q.from(Orders.class);
        q.multiselect(b.function(time, Integer.class, root.get("createdAt")),
                b.sum(root.get("totalPrice")));
        
        Predicate pYear = b.equal(b.function("YEAR", Integer.class, root.get("createdAt")), year);
        Predicate pStatus = b.equal(root.get("statusPay"), "COMPLETED");
        
        
        q.where(b.and(pYear, pStatus));
        
        q.groupBy(b.function(time, Integer.class, root.get("createdAt")));
        
        Query query = s.createQuery(q);
        return query.getResultList();
    }

}
