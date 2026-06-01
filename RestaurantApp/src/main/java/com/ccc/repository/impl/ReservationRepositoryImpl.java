/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.ccc.pojo.Reservation;
import com.ccc.repository.ReservationRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

/**
 *
 * @author Admin
 */
@Repository
@Transactional
public class ReservationRepositoryImpl implements ReservationRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Reservation> getReservations(Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Reservation> q = b.createQuery(Reservation.class);
        Root<Reservation> root = q.from(Reservation.class);
        root.fetch("tableId", JoinType.LEFT);
        root.fetch("userId", JoinType.LEFT);
        q.select(root);

        List<Predicate> predicates = new ArrayList<>();
        if (params != null) {
            String userId = params.get("userId");
            if (userId != null && !userId.isEmpty()) {
                predicates.add(b.equal(root.get("userId").get("id"), Integer.parseInt(userId)));
            }

            String tableId = params.get("tableId");
            if (tableId != null && !tableId.isEmpty()) {
                predicates.add(b.equal(root.get("tableId").get("id"), Integer.parseInt(tableId)));
            }

            String status = params.get("status");
            if (status != null && !status.isEmpty()) {
                predicates.add(b.equal(root.get("status"), status));
            }
        }
        q.where(predicates.toArray(Predicate[]::new));
        q.orderBy(b.desc(root.get("createdAt")));

        Query query = s.createQuery(q);

        // Logic phân trang
        if (params != null) {
            String page = params.get("page");
            if (page != null && !page.isEmpty()) {
                int p = Integer.parseInt(page);
                int pageSize = 6;
                query.setMaxResults(pageSize);
                query.setFirstResult((p - 1) * pageSize);
            }
        }

        return query.getResultList();
    }

    @Override
    public void addOrUpdate(Reservation r) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(r);
    }

    @Override
    public void delete(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Reservation r = this.getById(id);
        if (r != null) {
            s.remove(r);
        }
    }

    @Override
    public Reservation getById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.get(Reservation.class, id);
    }

    @Override
    public List<Reservation> getReservationsByUserId(int userId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Reservation> q = b.createQuery(Reservation.class);
        Root<Reservation> root = q.from(Reservation.class);
        q.select(root);
        q.where(b.equal(root.get("userId").get("id"), userId));
        q.orderBy(b.desc(root.get("createdAt")));
        Query query = s.createQuery(q);
        return query.getResultList();
    }

    @Override
    public List<Reservation> getReservationsByTableId(int tableId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Reservation> q = b.createQuery(Reservation.class);
        Root<Reservation> root = q.from(Reservation.class);
        q.select(root);
        q.where(b.equal(root.get("tableId").get("id"), tableId));
        q.orderBy(b.desc(root.get("createdAt")));
        Query query = s.createQuery(q);
        return query.getResultList();
    }

    @Override
    public boolean hasTimeConflict(int tableId, Date startTime, Date endTime, Integer excludeReservationId) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Reservation> q = b.createQuery(Reservation.class);
        Root<Reservation> root = q.from(Reservation.class);

        List<Predicate> predicates = new ArrayList<>();

        predicates.add(b.equal(root.get("tableId").get("id"), tableId));

        predicates.add(b.notEqual(root.get("status"), "CANCELLED"));
        predicates.add(b.notEqual(root.get("status"), "COMPLETED"));

        predicates.add(b.or(
                b.and(
                        b.lessThanOrEqualTo(root.get("startTime"), startTime),
                        b.greaterThan(root.get("endTime"), startTime)
                ),
                b.and(
                        b.lessThan(root.get("startTime"), endTime),
                        b.greaterThanOrEqualTo(root.get("endTime"), endTime)
                ),
                b.and(
                        b.greaterThanOrEqualTo(root.get("startTime"), startTime),
                        b.lessThanOrEqualTo(root.get("endTime"), endTime)
                )
        ));

        if (excludeReservationId != null) {
            predicates.add(b.notEqual(root.get("id"), excludeReservationId));
        }

        q.where(predicates.toArray(Predicate[]::new));

        Query query = s.createQuery(q);
        List<Reservation> conflictingReservations = query.getResultList();

        return !conflictingReservations.isEmpty();
    }

    @Override
    public long countReservations(Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        Root<Reservation> root = q.from(Reservation.class);
        q.select(b.count(root));

        List<Predicate> predicates = new ArrayList<>();
        if (params != null) {
            String userId = params.get("userId");
            if (userId != null && !userId.isEmpty()) {
                predicates.add(b.equal(root.get("userId").get("id"), Integer.parseInt(userId)));
            }

            String tableId = params.get("tableId");
            if (tableId != null && !tableId.isEmpty()) {
                predicates.add(b.equal(root.get("tableId").get("id"), Integer.parseInt(tableId)));
            }

            String status = params.get("status");
            if (status != null && !status.isEmpty()) {
                predicates.add(b.equal(root.get("status"), status));
            }
        }
        q.where(predicates.toArray(Predicate[]::new));

        Query query = s.createQuery(q);
        return (Long) query.getSingleResult();
    }
}
