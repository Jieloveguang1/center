package com.lhj.feign;

import domain.User;
import domain.result.BaseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@FeignClient("user-server")
public interface UserFeign {
    @GetMapping("/api/user/search/{id}")
    BaseResponse<User> searchUserById(@PathVariable("id") Long id);

    @PostMapping("/api/user/isAdmin")
    BaseResponse<Boolean> isAdmin(@RequestBody User user);
}
