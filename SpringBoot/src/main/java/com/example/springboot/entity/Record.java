package com.example.springboot.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Data
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;

    // 对局玩家1 可以直接规定玩家一就是警察身份 玩家二就是小偷身份 这样可以减少后端user类需要存储的属性
    @ManyToOne(fetch = FetchType.LAZY,targetEntity = User.class,cascade = CascadeType.ALL)
    @JoinColumn(name = "police")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private User police;

    // 对局玩家2
    @ManyToOne(fetch = FetchType.LAZY,targetEntity = User.class,cascade = CascadeType.ALL)
    @JoinColumn(name = "thief")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private User thief;

    // 对局开始的时间
    @DateTimeFormat(pattern = "yyyy-mm-dd hh:mm:ss")
    private Date startTime;

    // 对局时长
    private String time;

    // 胜利玩家id
    private Long winnerId;

    // 胜利玩家扮演的角色
    private Long winnerRole;

    // 最终比分？ like 90:60
    private String score;
}
