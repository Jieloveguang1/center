package com.lhj.service.impl;


import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lhj.mapper.UserTeamMapper;
import com.lhj.service.TeamService;
import com.lhj.service.UserTeamService;
import domain.UserTeam;
import org.springframework.stereotype.Service;

/**
* @author Li
* @description 针对表【user_team(用户队伍关系)】的数据库操作Service实现
* @createDate 2023-06-12 18:54:17
*/
@Service
public class UserTeamServiceImpl extends ServiceImpl<UserTeamMapper, UserTeam>
    implements UserTeamService {

}




