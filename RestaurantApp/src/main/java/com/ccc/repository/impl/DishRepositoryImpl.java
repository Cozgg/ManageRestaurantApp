/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository.impl;

import com.ccc.pojo.Dish;
import com.ccc.repository.DishRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Admin
 */
@Repository
@PropertySource("classpath:configs.properties")
@Transactional
public class DishRepositoryImpl implements DishRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private Environment env;
    
    @Override
    public List<Dish> getDishs(Map<String, String> params) {
        Session session = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Dish> q = b.createQuery(Dish.class);
        Root root = q.from(Dish.class);
        q.select(root);

        if (params != null) {
            List<Predicate> predicates = new ArrayList<>();

            String kw = params.get("kw");
            if (kw != null && !kw.isEmpty()) {
                predicates.add(b.like(root.get("name"), String.format("%%%s%%", kw)));
            }

            String categoryId = params.get("cateId");
            if (categoryId != null && !categoryId.isEmpty()) {
                predicates.add(b.equal(root.get("categoryId").as(Integer.class), categoryId));
            }

            q.where(predicates.toArray(Predicate[]::new));
        }

        q.orderBy(b.desc(root.get("id")));

        Query query = session.createQuery(q);

        if (params != null) {
            int pageSize = this.env.getProperty("dishes.page_size", Integer.class);
            int page = Integer.parseInt(params.getOrDefault("page", "1"));
            int start = (page - 1) * pageSize;

            query.setMaxResults(pageSize);
            query.setFirstResult(start);
        }

        return query.getResultList();
    }

    @Override
    public Dish getDishById(Integer id) {
        Session session = this.factory.getObject().getCurrentSession();
        return session.get(Dish.class, id);
    }

    @Override
    public void saveDish(Dish dish) {
        Session session = this.factory.getObject().getCurrentSession();
        session.persist(dish);
    }

    @Override
    public void updateDish(Dish dish) {
        Session session = this.factory.getObject().getCurrentSession();
        session.merge(dish);
    }

    @Override
    public void deleteDish(Integer id) {
        Session session = this.factory.getObject().getCurrentSession();
        Dish dish = session.get(Dish.class, id);
        if (dish != null) {
            session.remove(dish);
        }
    }

    @Override
    public void transferDishes(int fromUserId, int toUserId) {
        Session session = this.factory.getObject().getCurrentSession();
        Query q = session.createQuery("UPDATE Dish d SET d.userId.id = :toId WHERE d.userId.id = :fromId");
        q.setParameter("toId", toUserId);
        q.setParameter("fromId", fromUserId);
        q.executeUpdate();
    }
}
