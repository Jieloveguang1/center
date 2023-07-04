package com.lhj.service;


import com.baomidou.mybatisplus.extension.service.IService;
import domain.User;
import domain.dto.UserQuery;
import domain.requestBody.UserLoginRequest;
import domain.requestBody.UserRegisterRequest;
import domain.vo.UserVO;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
* @author Li
* @description 针对表【user(用户)】的数据库操作Service
* @createDate 2023-06-07 15:15:16
*/
public interface UserService extends IService<User> {
    Long userRegister(UserRegisterRequest registerRequest);

    User userLongin(UserLoginRequest userLoginRequest, HttpServletRequest request);

    List<User> searchByCondition(UserQuery conditionUser);

    Boolean deleteByIds(int[] ids);

    List<User> searchByTags(List<String> tagNames);

   User getLoginUser(String sessionId,HttpServletRequest request);


    Boolean isAdmin(User user);

    Integer updateUser(User user,User loginUser);

    List<UserVO> matchUsers(Integer num, User loginUser);



}
