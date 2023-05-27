package com.example.springboot.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class MySqlConnector {
    private Connection connection;

    public MySqlConnector() throws ClassNotFoundException, SQLException, IOException{
        Resource resource = new ClassPathResource("application.properties");
        try(FileInputStream fis = new FileInputStream(resource.getFile())) {
            Properties pro = new Properties();
            pro.load(fis);
            String driverClass = pro.getProperty("spring.datasource.driver-class-name");
            String url = pro.getProperty("spring.datasource.url");
            String user = pro.getProperty("spring.datasource.username");
            String password = pro.getProperty("spring.datasource.password");
            Class.forName(driverClass);
            connection = DriverManager.getConnection(url,user,password);
        }
    }

    public Connection getConnection() {
        return connection;
    }

    public void closeConnection() throws SQLException
    {
        connection.close();
    }
}
