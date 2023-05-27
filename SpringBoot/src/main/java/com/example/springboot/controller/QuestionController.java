package com.example.springboot.controller;

import com.example.springboot.entity.Question;
import com.example.springboot.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/question")
@RestController
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping("getOne")
    @ResponseBody
    public Question getOne()
    {
        return questionService.getQuestionRandomly();
    }
}
