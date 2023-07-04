package com.lhj.feign;

import common.ErrorCode;
import domain.User;
import domain.requestBody.UserLoginRequest;
import domain.requestBody.UserRegisterRequest;
import domain.result.BaseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("login-server")
public interface LoginFeign {
    @GetMapping("/server/current")
   BaseResponse<User> getCurrentUser();

    @PostMapping("/server/login")
    BaseResponse<User> userLongin(@RequestBody UserLoginRequest userRequestBody);

    @PostMapping("/server/register")
    BaseResponse<Long> userRegister(@RequestBody UserRegisterRequest userRequestBody);

    @PostMapping("/server/logout")
    BaseResponse<Integer> loginOut();
}
