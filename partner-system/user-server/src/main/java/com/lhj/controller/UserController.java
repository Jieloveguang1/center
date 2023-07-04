package com.lhj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.google.gson.Gson;
import common.ErrorCode;
import common.util.SafetyUserUtils;
import com.lhj.exception.BusinessException;
import com.lhj.service.UserService;

import domain.User;
import domain.dto.UserQuery;
import domain.requestBody.UserLoginRequest;
import domain.requestBody.UserRegisterRequest;
import domain.requestBody.UserTagRequest;
import domain.result.BaseResponse;
import domain.vo.UserVO;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/user")
@Slf4j
public class UserController {

    private static final String USER_LONGIN="useLonginState";

    @Resource
    private UserService userService;

    @Resource
    private RedisTemplate<String,Object> redisTemplate;

    private String tempSessionId;

    /**
     * 注册用户
     * @param userRequestBody 请求注册输入的用户信息
     * @return
     */
    @PostMapping("/register")
    public BaseResponse<Long> userRegister(@RequestBody UserRegisterRequest userRequestBody){
        if(userRequestBody.getUserAccount()==null) throw new BusinessException(ErrorCode.NULL_ERROR);
        Long userId= userService.userRegister(userRequestBody);
        if(userId==null) throw new BusinessException(ErrorCode.SYSTEM_ERROR,"注册失败");
        return new BaseResponse<>(ErrorCode.SUCCESS,userId);
    }

    /**
     * 用户登录
     * @param userRequestBody 请求登录的用户信息
     * @param request 请求的http对象
     * @return
     */
    @PostMapping("/login")
    public BaseResponse<User> userLongin(@RequestBody UserLoginRequest userRequestBody, HttpServletRequest request){
        if(userRequestBody.getUserAccount()==null || userRequestBody.getUserPassword()=="") {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        tempSessionId=userRequestBody.getSessionId();
        System.out.println("userRequestBody = " + userRequestBody + ", request = " + request);
        User user = userService.userLongin(userRequestBody, request);
        return new BaseResponse<User>(ErrorCode.SUCCESS,user);
    }

    /**
     * 查询用户
     * @param id
     * @return
     */
    @GetMapping("/search/{id}")
    public BaseResponse<User> searchUserById(@PathVariable("id") Long id){
        if(id==null) throw  new BusinessException(ErrorCode.PARAMS_ERROR,"参数不能为空");
        User user = userService.getById(id);
        return new BaseResponse<>(ErrorCode.SUCCESS,user);
    }

    /**
     * 删除用户
     * @param id
     * @return
     */
    @DeleteMapping("/delete")
    public BaseResponse<Boolean> deleteById(Long id){
        if(id<=0) throw new BusinessException(ErrorCode.PARAMS_ERROR);
        boolean handleTag = userService.removeById(id);
        if(handleTag) return new BaseResponse<>(ErrorCode.SUCCESS,true);
        return new BaseResponse<>(ErrorCode.SYSTEM_ERROR,false);
    }

    /**
     * 获取当前登录用户
     * @return
     */
    @GetMapping("/current")
    public BaseResponse<User> getCurrentUser(@RequestParam String sessionId,HttpServletRequest request) {
        Object userObj = redisTemplate.opsForValue().get(sessionId);
        if(userObj==null)userObj=request.getSession().getAttribute(USER_LONGIN);
        User currentUser = (User) userObj;
        if (currentUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN);
        }
        long userId = currentUser.getId();
        // TODO 校验用户是否合法
        User user = userService.getById(userId);
        User safetyUser = SafetyUserUtils.toSafeTyUser(user);
        return new BaseResponse<User>(ErrorCode.SUCCESS,safetyUser);
    }

    @PostMapping("/logout")
    public BaseResponse<Integer> loginOut(@RequestBody String sessionId,HttpServletRequest request){
        tempSessionId=null;
        redisTemplate.delete(sessionId);
        request.getSession().removeAttribute(USER_LONGIN);
        return new BaseResponse<>(ErrorCode.SUCCESS);
    }

    /**
     * 获取所有用户信息
     * @param request
     * @return
     */
    @GetMapping("/search")
    public BaseResponse<List<User>> getUsers(HttpServletRequest request){
        Object userObj = request.getSession().getAttribute(USER_LONGIN);
        User currentUser = (User) userObj;
        long userId = currentUser.getId();
        List<User> list = userService.list();
        if(list==null) throw new BusinessException(ErrorCode.NULL_ERROR);
        return new BaseResponse<List<User>>(ErrorCode.SUCCESS,list);
    }

    @PostMapping ("/searchByCondition")
    public BaseResponse<List<User>> selectByConditions(@RequestBody UserQuery conditionUser){
        List<User> users = userService.searchByCondition(conditionUser);
        if(users==null) return new BaseResponse<>(ErrorCode.NULL_ERROR);
        List<User> safeTyUsers=new ArrayList<>();
        for (User user : users) {
            User safeTyUser = SafetyUserUtils.toSafeTyUser(user);
            safeTyUsers.add(safeTyUser);
        }
        return new BaseResponse<List<User>>(ErrorCode.SUCCESS,safeTyUsers);
    }

    /**
     * 批量删除，通过id数组
     * @param ids 要删除的id数组
     * @return
     */
    @DeleteMapping("/deleteByIds")
    public BaseResponse<Boolean> deleteByIds(@RequestBody int[] ids){
        Boolean deleteTag =  userService.deleteByIds(ids);
        if(deleteTag==false) return new BaseResponse<>(ErrorCode.SYSTEM_ERROR,false);
        return new BaseResponse<>(ErrorCode.SUCCESS,true);
    }

    /**
     * 标签查找
     * @param tagNames
     * @return
     */
    @GetMapping("/search/tags")
    public BaseResponse<List<User>> searchByTags(@RequestParam List<String> tagNames){
        if(tagNames.size()<=0) throw new BusinessException(ErrorCode.PARAMS_ERROR);
        List<User> users = userService.searchByTags(tagNames);
        return new BaseResponse<List<User>>(ErrorCode.SUCCESS,users);
    }

    /**
     * 修改用户信息
     * @param user 要修改的用户
     * @param request
     * @return
     */
    @PostMapping("/update")
    public BaseResponse<Boolean> updateUser(@RequestBody User user,HttpServletRequest request){
        User loginUser = userService.getLoginUser(tempSessionId,request);
        if(user==null || loginUser ==null)throw new BusinessException(ErrorCode.PARAMS_ERROR);
        Integer updateLows = userService.updateUser(user, loginUser);
        if(updateLows<=0) return new BaseResponse<Boolean>(ErrorCode.SYSTEM_ERROR,false);
        return new BaseResponse<>(ErrorCode.SUCCESS,true);
    }

    /**
     * 修改用户标签
     * @param userTagRequest 请示参数
     * @param request
     * @return
     */
    @PostMapping("/update/tags")
    public BaseResponse<Boolean> updateTags(@RequestBody UserTagRequest userTagRequest, HttpServletRequest request){
        User loginUser = userService.getLoginUser(tempSessionId,request);
        if(userTagRequest==null || loginUser ==null)throw new BusinessException(ErrorCode.PARAMS_ERROR);
        String[] parsedTags= userTagRequest.getParsedTags();
        Gson gson = new Gson();
        String tags = gson.toJson(parsedTags);
        User user = new User();
        user.setId(loginUser.getId());
        user.setTags(tags);
        boolean update = userService.updateById(user);
        if(!update) return new BaseResponse<Boolean>(ErrorCode.SYSTEM_ERROR,false);
        return new BaseResponse<>(ErrorCode.SUCCESS,true);
    }

    /**
     * 推荐匹配
     * @return
     */
    @GetMapping("/match")
    public BaseResponse<List<UserVO>> matchUsers(HttpServletRequest request){
        int num=10;
        User loginUser = userService.getLoginUser(tempSessionId,request);
        if(loginUser==null)throw new BusinessException(ErrorCode.NOT_LOGIN);
        List<UserVO> userVOList=userService.matchUsers(num,loginUser);
        return new BaseResponse<>(ErrorCode.SUCCESS,userVOList);
    }

    @PostMapping("/isAdmin")
    public BaseResponse<Boolean> isAdmin(@RequestBody User user){
        Boolean isAdmin = userService.isAdmin(user);
        return new BaseResponse<>(ErrorCode.SUCCESS,isAdmin);
    }

    @PostMapping("/avatar/upload")
    public BaseResponse<String> uploadImage(@RequestParam("file") MultipartFile file,HttpServletRequest request) {
        try {
            // 生成唯一的文件名
            String fileName = UUID.randomUUID()+ "." + getFileExtension(file.getOriginalFilename());

            // 保存图片文件到指定目录
            String imagePath = "D:\\java\\partner-system\\user-server\\src\\main\\resources\\images";
            String filePath=imagePath+File.separator+fileName;
            FileCopyUtils.copy(file.getBytes(), new FileOutputStream(filePath));


            // TODO 没有实现图片上面
            //String imageUrl = "http://localhost:8080/images/" + fileName;
            String fakeUrl="https://img0.baidu.com/it/u=955960049,1441760847&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500";
            // 返回图片 URL
            User loginUser = userService.getLoginUser(tempSessionId,request);
            User user = new User();
            user.setId(loginUser.getId());
            user.setAvatarUrl(fakeUrl);
            userService.updateById(user);
            return new BaseResponse<String>(ErrorCode.SUCCESS,fakeUrl);
        } catch (IOException e) {
            // 处理上传失败的情况
            return new BaseResponse<>(ErrorCode.SYSTEM_ERROR,"图片上传失败");
        }
    }

    private String getFileExtension(String filename) {
        // 获取文件的扩展名
        int dotIndex = filename.lastIndexOf(".");
        if (dotIndex < 0 || dotIndex >= filename.length() - 1) {
            return "";
        }
        return filename.substring(dotIndex + 1).toLowerCase();
    }
}



