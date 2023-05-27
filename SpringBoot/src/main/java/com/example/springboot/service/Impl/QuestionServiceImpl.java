package com.example.springboot.service.Impl;

import com.example.springboot.dao.QuestionDao;
import com.example.springboot.entity.Question;
import com.example.springboot.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionDao questionDao;

    @Override
    public Question getQuestionRandomly() {
        List<Question> tot = questionDao.findAll();
        return tot.get(new Random().nextInt(tot.size()));
    }
}
