package com.example.springboot.dao;

import com.example.springboot.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordDao extends JpaRepository<Record,Long> {
    @Query(value = "select * from record where police_id = ?1 or thief_id = ?1 order by start_time asc ",nativeQuery = true)
    List<Record> findRecordsByUser(Long userId);

}
