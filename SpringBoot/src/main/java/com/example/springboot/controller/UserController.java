package com.example.springboot.controller;

import com.example.springboot.entity.User;
import com.example.springboot.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class UserController {
    @Resource
    private UserService userService;

    @PostMapping("/login")
    @ResponseBody
    public User login(@RequestBody Map<String,String> params, HttpServletRequest httpServletRequest) throws Exception{
        System.out.println(params.get("username"));
        System.out.println(params.get("password"));
        if (userService.check(params.get("username"), params.get("password"))) {
            User user = userService.findUserByUsername(params.get("username"));
            httpServletRequest.getSession().setAttribute("user", user);
            return user;

        }
        return null;
    }

    @GetMapping("/logout")
    @ResponseBody
    public Boolean logout(HttpServletRequest httpServletRequest) throws Exception{
        httpServletRequest.getSession().removeAttribute("user");;
        return Boolean.TRUE;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user,HttpServletRequest httpServletRequest) throws Exception{
        User user1 = userService.addUser(user);
        httpServletRequest.getSession().setAttribute("user",user1);
        return user1;
    }

    @PostMapping("/change")
    public User change(@RequestBody User user,HttpServletRequest httpServletRequest){

        User userNew = userService.change(user.getUsername(),user.getPassword(), user.getId());
        httpServletRequest.getSession().setAttribute("user",userNew);
        return user;
    }
}
