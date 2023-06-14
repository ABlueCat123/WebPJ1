package com.example.springboot.service.Impl;

import com.example.springboot.dao.UserDao;
import com.example.springboot.entity.User;
import com.example.springboot.service.UserService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class UserServiceImpl implements UserService {
    @Resource
    private UserDao userDao;
    @Override
    public Boolean check(String username, String password) {
        if (userDao.findByUsernameAndPassword(username,password) == null) return Boolean.FALSE;
        return Boolean.TRUE;
    }

    @Override
    public User findUserByUsername(String username) {
        return userDao.findByUsername(username);
    }

    @Override
    public User findUserById(Long id) {
        return userDao.findUserById(id);
    }

    @Override
    public Boolean deleteUserById(Long id) {
        return userDao.deleteUserById(id);
    }

    @Override
    public Boolean deleteUserByUsername(String username) {
        return userDao.deleteUsersByUsername(username);
    }

    @Override
    public User updateUser(User user) {
        if (findUserByUsername(user.getUsername()) == null) return null;
        return userDao.save(user);
    }

    @Override
    public List<User> findAll() {
        return userDao.findAll();
    }

    @Override
    public User addUser(User user) {
        if (findUserByUsername(user.getUsername()) == null)return userDao.save(user);
        return null;
    }

    @Override
    public User change(String username, String password,Long id) {
        if (userDao.update(username,password,id) > 0) return findUserById(id);
        return null;
    }
}
