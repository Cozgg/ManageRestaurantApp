/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository.impl;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;

/**
 * @author Admin
 */
public abstract class AbstractStatRepository {

    @Autowired
    protected LocalSessionFactoryBean factory;

    protected List<Object[]> statsByTimeTemplate(Class<?> entityClass, String dateField, String timeFunc, int year) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        Root root = q.from(entityClass);

        configureMultiselect(q, b, root, timeFunc, dateField);

        q.where(b.equal(b.function("YEAR", Integer.class, root.get(dateField)), year));
        
        q.groupBy(b.function(timeFunc, Integer.class, root.get(dateField)));
        q.orderBy(b.asc(b.function(timeFunc, Integer.class, root.get(dateField))));

        Query query = s.createQuery(q);
        return query.getResultList();
    }

    protected abstract void configureMultiselect(CriteriaQuery<Object[]> q, CriteriaBuilder b, Root root, String timeFunc, String dateField);
}
