/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.ccc.pojo.Rating;
import com.ccc.pojo.User;
import com.ccc.repository.RatingRepository;

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
    public Rating updateRating(Rating r) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(r);
        return r;
    }

    @Override
    public List<Rating> getRatingsByDishId(int dishId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createQuery("SELECT r FROM Rating r WHERE r.dishId.id = :dishId ORDER BY r.createdAt DESC", Rating.class);
        q.setParameter("dishId", dishId);
        return q.getResultList();
    }

    @Override
    public Rating getRatingByUserAndDish(User user, int dishId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createQuery("SELECT r FROM Rating r WHERE r.userId.id = :userId AND r.dishId.id = :dishId", Rating.class);
        q.setParameter("userId", user.getId());
        q.setParameter("dishId", dishId);
        try {
            return (Rating) q.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
}
