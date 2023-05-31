package com.example.springboot.dao;

import com.example.springboot.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User,Long> {
    User findByUsername(String username);
    User findByUsernameAndPassword(String username,String password);
    User findUserById(Long id);
    Boolean deleteUserById(Long id);
    Boolean deleteUsersByUsername(String username);

    @Transactional
    @Modifying
    @Query(value = "update user set password = ?2 where username = ?1",nativeQuery = true)
    int update(String username,String password);

}
