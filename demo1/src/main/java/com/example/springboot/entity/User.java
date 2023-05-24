package com.example.springboot.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;


@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true,length = 32)
    private String username;

    @Column(nullable = false,length = 16)
    private String password;

    @OneToMany(targetEntity = Record.class,fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @OrderBy("startTime ASC")
    private List<Record> records;
}
