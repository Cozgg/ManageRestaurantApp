/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository.impl;

import com.ccc.pojo.RestaurantTable;
import com.ccc.repository.TableRepository;
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
public class TableRepositoryImpl implements TableRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<RestaurantTable> getTables(java.util.Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        jakarta.persistence.criteria.CriteriaBuilder b = s.getCriteriaBuilder();
        jakarta.persistence.criteria.CriteriaQuery<RestaurantTable> q = b.createQuery(RestaurantTable.class);
        jakarta.persistence.criteria.Root root = q.from(RestaurantTable.class);
        q.select(root);

        java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
        if (params != null) {
            String capacity = params.get("capacity");
            if (capacity != null && !capacity.isEmpty()) {
                predicates.add(b.greaterThanOrEqualTo(root.get("capacity"), Integer.parseInt(capacity)));
            }

            String active = params.get("active");
            if (active != null && !active.isEmpty()) {
                predicates.add(b.equal(root.get("active"), Boolean.parseBoolean(active)));
            }
        }
        q.where(predicates.toArray(jakarta.persistence.criteria.Predicate[]::new));

        Query query = s.createQuery(q);
        return query.getResultList();
    }

    @Override
    public void addOrUpdate(RestaurantTable t) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(t);
    }

    @Override
    public void delete(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        RestaurantTable t = this.getById(id);
        if (t != null) {
            s.remove(t);
        }
    }

    @Override
    public RestaurantTable getById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.get(RestaurantTable.class, id);
    }
}
