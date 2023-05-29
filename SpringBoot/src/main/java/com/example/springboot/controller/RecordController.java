package com.example.springboot.controller;

import com.example.springboot.entity.Record;
import com.example.springboot.service.RecordService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RecordController {

    @Resource
    private RecordService recordService;

    @PostMapping("/record/add")
    @ResponseBody
    public Boolean addRecord(@RequestBody Record record){
        System.out.println(record);
        if (recordService.addRecord(record) == null) return Boolean.FALSE;
        return Boolean.TRUE;
    }

    @GetMapping("/record/getByUser")
    public List<Record> getRecordsByUser(Long userId){
        return recordService.findRecordsByUser(userId);
    }
}
