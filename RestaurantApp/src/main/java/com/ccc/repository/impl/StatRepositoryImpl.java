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
public class StatRepositoryImpl extends AbstractStatRepository implements StatRepository {

    @Override
    public List<Object[]> statsRevenueByTime(String time, int year) {
        return statsByTimeTemplate(Orders.class, "createdAt", time, year);
    }

    @Override
    public List<Object[]> statsReservationsByTime(String time, int year) {
        return statsByTimeTemplate(com.ccc.pojo.Reservation.class, "createdAt", time, year);
    }

    @Override
    protected void configureMultiselect(CriteriaQuery<Object[]> q, CriteriaBuilder b, Root root, String timeFunc, String dateField) {
        if (root.getJavaType().equals(Orders.class)) {
            q.multiselect(b.function(timeFunc, Integer.class, root.get(dateField)),
                    b.sum(root.get("totalPrice")));
        } else if (root.getJavaType().equals(com.ccc.pojo.Reservation.class)) {
            q.multiselect(b.function(timeFunc, Integer.class, root.get(dateField)),
                    b.count(root.get("id")));
        }
    }

    @Override
    public List<Object[]> statsTopDishes(int top) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        Root<com.ccc.pojo.Dish> root = q.from(com.ccc.pojo.Dish.class);
        Join<com.ccc.pojo.Dish, com.ccc.pojo.OrderDetail> join = root.join("orderDetailSet", JoinType.INNER);

        q.multiselect(root.get("id"), root.get("name"), b.sum(join.get("quantity")));
        q.groupBy(root.get("id"), root.get("name"));
        q.orderBy(b.desc(b.sum(join.get("quantity"))));

        Query query = s.createQuery(q);
        query.setMaxResults(top);
        return query.getResultList();
    }
}
