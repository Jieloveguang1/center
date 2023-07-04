package com.lhj.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import domain.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
* @author Li
* @description 针对表【user(用户)】的数据库操作Mapper
* @createDate 2023-06-07 15:15:16
* @Entity generator.domain.User
*/
public interface UserMapper extends BaseMapper<User> {
    List<User> findByCondition(User user);

    int deleteByIds(@Param("ids") int[] ids);

    List<User> selectPages(int first,int pageSize);
}




