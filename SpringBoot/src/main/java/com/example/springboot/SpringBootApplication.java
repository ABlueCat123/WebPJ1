package com.example.springboot;

import com.example.springboot.util.MySqlConnector;
import com.example.springboot.util.SqlFileExecutor;
import org.springframework.boot.SpringApplication;

import java.sql.Connection;

@org.springframework.boot.autoconfigure.SpringBootApplication
public class SpringBootApplication {

    public static void main(String[] args) {
        SqlFileExecutor sqlFileExecutor = new SqlFileExecutor();
        try {
            Connection connection = new MySqlConnector().getConnection();
            sqlFileExecutor.executeSql(connection,"sql/data.sql");
        }catch (Exception e){
            e.printStackTrace();
            return;
        }
        SpringApplication.run(SpringBootApplication.class, args);
    }

}
