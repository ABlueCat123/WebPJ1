package com.example.springboot.service;

import com.example.springboot.entity.Record;

import java.util.List;

public interface RecordService {
    List<Record> findRecordsByUser(Long userId);
    Record addRecord(Record record);
}
