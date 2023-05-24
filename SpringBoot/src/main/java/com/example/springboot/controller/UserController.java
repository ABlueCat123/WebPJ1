package com.example.springboot.controller;

import com.example.springboot.entity.User;
import com.example.springboot.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    @Resource
    private UserService userService;

    @PostMapping("/login")
    @ResponseBody
    public Boolean login(@Param("username")String username, @Param("password") String password, HttpServletRequest httpServletRequest) throws Exception{
        if (userService.check(username,password)) {
            httpServletRequest.getSession().setAttribute("user", userService.findUserByUsername(username));
            return Boolean.TRUE;
        }
        return Boolean.FALSE;
    }

    @GetMapping("/logout")
    @ResponseBody
    public Boolean logout(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception{
        httpServletRequest.getSession().removeAttribute("user");
//        httpServletResponse.sendRedirect("login");
        return Boolean.TRUE;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user,HttpServletResponse httpServletResponse,HttpServletRequest httpServletRequest) throws Exception{
        System.out.println(user);
        User user1 = userService.addUser(user);
        httpServletRequest.getSession().setAttribute("user",user1);
//        httpServletResponse.sendRedirect("index");
        return user1;
    }
}
