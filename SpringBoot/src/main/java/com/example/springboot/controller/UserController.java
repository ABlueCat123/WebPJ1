package com.example.springboot.controller;

import com.example.springboot.entity.Record;
import com.example.springboot.entity.User;
import com.example.springboot.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class UserController {
    @Resource
    private UserService userService;

    @GetMapping("/login")
    @ResponseBody
    public Boolean login(@Param("username")String username, @Param("password") String password, HttpServletRequest httpServletRequest) throws Exception{
        System.out.println(username);
        System.out.println(password);
        if (userService.check(username,password)) {
            User user = userService.findUserByUsername(username);
            httpServletRequest.getSession().setAttribute("user", user);
            return Boolean.TRUE;
        }
        return Boolean.FALSE;
    }

    @GetMapping("/logout")
    @ResponseBody
    public Boolean logout(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception{
        httpServletRequest.getSession().removeAttribute("user");
//        httpServletResponse.sendRedirect(httpServletRequest.getContextPath() + "/login");
        return Boolean.TRUE;
    }

    // 重定向是直接登录还是咋样？但是重定向的原因在于，封装的请求头的方式为Get
    @PostMapping("/register")
    public User register(@RequestBody User user,HttpServletResponse httpServletResponse,HttpServletRequest httpServletRequest) throws Exception{
//        System.out.println(user);
        User user1 = userService.addUser(user);
        httpServletRequest.getSession().setAttribute("user",user1);
        httpServletResponse.sendRedirect(httpServletRequest.getContextPath() + "/login?username=" + user1.getUsername() + "&password=" + user1.getPassword());
        return user1;
    }
}
