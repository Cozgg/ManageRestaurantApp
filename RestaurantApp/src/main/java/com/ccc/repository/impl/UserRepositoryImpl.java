/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.repository.impl;

import com.ccc.pojo.User;
import com.ccc.repository.UserRepository;
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
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public User getUserByUsername(String username) {
        Session session = this.factory.getObject().getCurrentSession();

        Query q = session.createNamedQuery("User.findByUsername", User.class);
        q.setParameter("username", username);
        return (User) q.getSingleResult();
    }

    @Override
    public User addUser(User u) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(u);
        return u;
    }

    @Override
    public List<User> getUsers() {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("User.findAll", User.class);
        return q.getResultList();
    }

    @Override
    public User getUserById(int userId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("User.findById", User.class);
        return (User) q.getSingleResult();
    }

}
