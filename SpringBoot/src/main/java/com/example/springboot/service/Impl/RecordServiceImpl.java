package com.example.springboot.service.Impl;

import com.example.springboot.dao.RecordDao;
import com.example.springboot.entity.Record;
import com.example.springboot.service.RecordService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecordServiceImpl implements RecordService {

    @Resource
    private RecordDao recordDao;
    @Override
    public List<Record> findRecordsByUser(Long userId) {
        return recordDao.findRecordsByUser(userId);
    }

    @Override
    public Record addRecord(Record record) {
        return recordDao.save(record);
    }
}
