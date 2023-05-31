package com.example.springboot.service;

import com.example.springboot.entity.User;

import java.util.List;

public interface UserService {
    Boolean check(String username,String password);
    User findUserByUsername(String username);
    User findUserById(Long id);
    Boolean deleteUserById(Long id);
    Boolean deleteUserByUsername(String username);
    User updateUser(User user);
    List<User> findAll();
    User addUser(User user);
    User change(String username,String password);
}
