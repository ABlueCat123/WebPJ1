package com.example.springboot.dao;

import com.example.springboot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User,Long> {
    User findByUsername(String username);
    User findByUsernameAndPassword(String username,String password);
    User findUserById(Long id);
    Boolean deleteUserById(Long id);
    Boolean deleteUsersByUsername(String username);

}
