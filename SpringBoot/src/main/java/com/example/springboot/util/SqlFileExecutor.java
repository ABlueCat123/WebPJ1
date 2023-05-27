package com.example.springboot.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class SqlFileExecutor
{
    public void executeSql(Connection conn, String filepath) throws SQLException, IOException
    {
        try (Statement stmt = conn.createStatement())
        {
            List<String> sqlList = readSqlFromFile(filepath);
            for (String sql : sqlList)
            {
                stmt.addBatch(sql);
            }
            // 执行
            conn.setAutoCommit(false);
            stmt.executeBatch();
            conn.commit();
            conn.setAutoCommit(true);
        }
        catch (SQLException e)
        {
            e.printStackTrace();
            // 回滚
            conn.rollback();
            throw new SQLException();
        }
    }

    private List<String> readSqlFromFile(String filepath) throws IOException
    {
        List<String> sqlList = new ArrayList<>();
        StringBuilder stringBuilder = new StringBuilder();
        byte[] buff = new byte[1024];
        int bytes;

        Resource resource = new ClassPathResource(filepath);

        try (FileInputStream fileInputStream = new FileInputStream(resource.getFile()))
        {
            // 将文件中的内容读取到StringBuilder
            while ((bytes = fileInputStream.read(buff)) != -1)
            {
                stringBuilder.append(new String(buff, 0, bytes));
            }
            // 以分号作为分隔
            String[] sqlArray = stringBuilder.toString().split(";");

            for (String s : sqlArray) {
                // 去掉注释
                String sql = s.replaceAll("--.*", "").trim();
                // 去掉注释后不为空，则认为是一个sql语句，加入到List中
                if (!sql.isEmpty()) {
                    sqlList.add(sql);
                }
            }
            return sqlList;
        }
    }
}
