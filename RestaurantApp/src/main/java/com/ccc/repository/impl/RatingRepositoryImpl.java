/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository.impl;

import com.ccc.pojo.Rating;
import com.ccc.repository.RatingRepository;
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
public class RatingRepositoryImpl implements RatingRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Rating addRating(Rating r) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(r);
        return r;
    }

    @Override
    public List<Rating> getRatingsByDishId(int dishId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createQuery("SELECT r FROM Rating r WHERE r.dishId.id = :dishId ORDER BY r.createdAt DESC", Rating.class);
        q.setParameter("dishId", dishId);
        return q.getResultList();
    }
}
