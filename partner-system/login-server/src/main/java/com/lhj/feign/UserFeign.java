package com.lhj.feign;

import domain.User;
import domain.requestBody.UserLoginRequest;
import domain.requestBody.UserRegisterRequest;
import domain.result.BaseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(value = "user-server")
public interface UserFeign {
    /**
     * 获取当前登录用户
     *
     * @param
     * @return
     */
    @GetMapping("/api/user/current")
    BaseResponse<User> getCurrentUser(@RequestParam String sessionId);

    @PostMapping("/api/user/login")
    BaseResponse<User> userLongin(@RequestBody UserLoginRequest userRequestBody);

    /**
     * 注册用户
     *
     * @param userRequestBody 请求注册输入的用户信息
     * @return
     */
    @PostMapping("/api/user/register")
    BaseResponse<Long> userRegister(@RequestBody UserRegisterRequest userRequestBody);

    /**
     * 注销
     *
     * @return
     */
    @PostMapping("/api/user/logout")
    BaseResponse<Integer> loginOut(@RequestBody String sessionId);

}