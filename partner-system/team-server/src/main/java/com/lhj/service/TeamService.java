package com.lhj.service;

import domain.Team;
import domain.User;
import domain.dto.TeamQuery;
import domain.requestBody.TeamJoinRequest;
import domain.requestBody.TeamUpdateRequest;
import domain.vo.TeamUserVO;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
* @author Li
* @description 针对表【team(队伍)】的数据库操作Service
* @createDate 2023-06-11 23:09:09
*/
public interface TeamService extends IService<Team> {
    long addTeam(Team team, User loginUser);

    List<TeamUserVO> listTeam(TeamQuery teamQuery, User loginUser, boolean isAdmin);

    Boolean updateTeam(TeamUpdateRequest teamUpdate, User loginUser);

    Boolean joinTeam(TeamJoinRequest joinRequest, User loginUser);

    Boolean quitTeam(Long teamId,User loginUser);

    Boolean deleteTeam(Long teamId, User loginUser);

    Boolean hasJoin(Long teamId,User loginUser);

    Integer hasJoinNum(Long teamId);
}
