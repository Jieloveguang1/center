package com.lhj.controller;

import com.lhj.feign.UserFeign;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import common.ErrorCode;
import domain.User;
import domain.requestBody.UserLoginRequest;
import domain.requestBody.UserRegisterRequest;
import domain.result.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/server")
public class LoginController {
    @Resource
    private UserFeign userFeign;
    private User currentUser;
    @Autowired
    private HttpSession session;

    @GetMapping("/current")
    public BaseResponse<User> getCurrentUser(){
        if(currentUser!=null) return new BaseResponse<>(ErrorCode.SUCCESS,currentUser);
        String sessionId = session.getId();
        return userFeign.getCurrentUser(sessionId);
    }


    @PostMapping("/login")
    public BaseResponse<User> userLongin(@RequestBody UserLoginRequest userRequestBody){
        String sessionId = session.getId();
        userRequestBody.setSessionId(sessionId);
        BaseResponse<User> baseResponse = userFeign.userLongin(userRequestBody);
        if(baseResponse.getData()!=null) currentUser = baseResponse.getData();
        return baseResponse;
    }


    @PostMapping("/register")
    public BaseResponse<Long> userRegister(@RequestBody UserRegisterRequest userRequestBody){
        return userFeign.userRegister(userRequestBody);
    }

    @PostMapping("/logout")
    BaseResponse<Integer> loginOut(){
        String sessionId = session.getId();
        currentUser=null;
        return userFeign.loginOut(sessionId);
    }



}
