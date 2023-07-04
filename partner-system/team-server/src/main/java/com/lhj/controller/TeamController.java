package com.lhj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lhj.exception.BusinessException;
import com.lhj.feign.LoginFeign;
import com.lhj.feign.UserFeign;
import com.lhj.service.TeamService;
import com.lhj.service.UserTeamService;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import common.ErrorCode;
import domain.Team;
import domain.User;
import domain.UserTeam;
import domain.dto.TeamQuery;
import domain.requestBody.*;
import domain.result.BaseResponse;
import domain.vo.TeamUserVO;
import domain.vo.UserVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/team")
@Slf4j
public class TeamController {

    @Resource
    private TeamService teamService;

    @Resource
    private UserFeign userFeign;
    @Resource
    private LoginFeign loginFeign;
    @Resource
    private UserTeamService userTeamService;

    @GetMapping("/add")
    public BaseResponse<Long> addTeam( TeamAddRequest teamAddRequest, HttpServletRequest request){
        if(teamAddRequest==null){
            throw new BusinessException(ErrorCode.PARAMS_ERROR,"队伍参数错误");
        }
        Team team=new Team();
        BeanUtils.copyProperties(teamAddRequest,team);
        BaseResponse<User> currentUser = loginFeign.getCurrentUser();
        User loginUser= currentUser.getData();
        Long teamId = teamService.addTeam(team, loginUser);
        if(teamId==null)return new BaseResponse<Long>(ErrorCode.SYSTEM_ERROR,teamId);
        return new BaseResponse<Long>(ErrorCode.SUCCESS,teamId);
    }


    @GetMapping("/list")
    public BaseResponse<List<TeamUserVO>> listTeam(TeamQuery teamQuery){
        if(teamQuery==null)throw new BusinessException(ErrorCode.PARAMS_ERROR,"查询参数为空");
        User loginUser = loginFeign.getCurrentUser().getData();
        Boolean isAdmin = userFeign.isAdmin(loginUser).getData();
        List<TeamUserVO> teamList=teamService.listTeam(teamQuery, loginUser, isAdmin);
        return new BaseResponse<>(ErrorCode.SUCCESS,teamList);
    }


    @PostMapping("/update")
    public BaseResponse<Boolean> updateTeam(@RequestBody TeamUpdateRequest teamUpdate){
        BaseResponse<User> currentUser = loginFeign.getCurrentUser();
        User loginUser= currentUser.getData();
        if(loginUser==null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN);
        }
        if(teamUpdate==null)throw new BusinessException(ErrorCode.PARAMS_ERROR,"无修改参数");
        Boolean updateTag= teamService.updateTeam(teamUpdate,loginUser);
        if(!updateTag)return new BaseResponse<>(ErrorCode.SYSTEM_ERROR, false);
        return new BaseResponse<Boolean>(ErrorCode.SUCCESS,true);
    }


    @PostMapping("/join")
    public BaseResponse<Boolean> joinTeam(@RequestBody TeamJoinRequest joinRequest){
        if(joinRequest==null)throw new BusinessException(ErrorCode.PARAMS_ERROR,"加入队伍参数为空");
        BaseResponse<User> currentUser = loginFeign.getCurrentUser();
        User loginUser= currentUser.getData();
        if(loginUser==null)throw new BusinessException(ErrorCode.NOT_LOGIN);
        Boolean joinTag=teamService.joinTeam(joinRequest,loginUser);
        if(!joinTag)return new BaseResponse<>(ErrorCode.SYSTEM_ERROR, false);
        return new BaseResponse<Boolean>(ErrorCode.SUCCESS,true);
    }

    @PostMapping("/quit")
    public BaseResponse<Boolean> quitTeam(@RequestBody TeamQuitRequest teamQuitRequest){
        Long teamId=teamQuitRequest.getTeamId();
        BaseResponse<User> currentUser = loginFeign.getCurrentUser();
        User loginUser= currentUser.getData();
        if(loginUser==null)throw new BusinessException(ErrorCode.NOT_LOGIN);
        if(teamId==null) throw new BusinessException(ErrorCode.PARAMS_ERROR,"队伍id不能为空");
        Boolean quitTag=teamService.quitTeam(teamId,loginUser);
        if(!quitTag){
            return new BaseResponse<Boolean>(ErrorCode.SYSTEM_ERROR,false);
        }
        return new BaseResponse<>(ErrorCode.SUCCESS,true);
    }

    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteTeam(@RequestBody TeamDeleteRequest teamDeleteRequest){
        if(teamDeleteRequest==null)throw new BusinessException(ErrorCode.PARAMS_ERROR,"请求参数为空");
        Long teamId = teamDeleteRequest.getId();
        BaseResponse<User> currentUser = loginFeign.getCurrentUser();
        User loginUser= currentUser.getData();
        if(loginUser==null)throw new BusinessException(ErrorCode.NOT_LOGIN);
        if(teamId==null) throw new BusinessException(ErrorCode.PARAMS_ERROR,"队伍id不能为空");
        Boolean quitTag=teamService.deleteTeam(teamId,loginUser);
        if(!quitTag){   
            return new BaseResponse<Boolean>(ErrorCode.SYSTEM_ERROR,false);
        }
        return new BaseResponse<>(ErrorCode.SUCCESS,true);
    }


    /**
     * 获取队伍信息
     * @param id 队伍id
     * @return
     */
    @GetMapping("/get")
    public BaseResponse<TeamUserVO> getTeam(@RequestParam Long id){
        BaseResponse<User> currentUser = loginFeign.getCurrentUser();
        User loginUser= currentUser.getData();
        if(loginUser==null)throw new BusinessException(ErrorCode.NOT_LOGIN);
        if(id==null)throw new BusinessException(ErrorCode.PARAMS_ERROR,"无队伍id");
        Team team = teamService.getById(id);
        if(team==null)throw new BusinessException(ErrorCode.PARAMS_ERROR,"无该队伍");
        TeamUserVO teamUserVO=new TeamUserVO();
        if(teamService.hasJoin(id,loginUser)){
            BeanUtils.copyProperties(team,teamUserVO);
            Long userId = team.getUserId();
            BaseResponse<User> userBaseResponse = userFeign.searchUserById(userId);
            User createUser =userBaseResponse.getData();
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(createUser,userVO);
            teamUserVO.setCreateUser(userVO);
        }
        return new BaseResponse<>(ErrorCode.SUCCESS,teamUserVO);
    }


    /**
     * 查询用户是否在队伍里
     * @param teamId 队伍id
     * @return
     */
    @GetMapping("/in")
    public BaseResponse<Boolean> isInTeam(@RequestParam Long teamId){
        User currentUser = loginFeign.getCurrentUser().getData();
        QueryWrapper<UserTeam> userTeamQueryWrapper = new QueryWrapper<>();
        userTeamQueryWrapper.eq("teamId",teamId);
        userTeamQueryWrapper.eq("userId",currentUser.getId());
        long count = userTeamService.count(userTeamQueryWrapper);
        if(count>= 1L){
            return new BaseResponse<>(ErrorCode.SUCCESS,true);
        }
        return new BaseResponse<>(ErrorCode.SUCCESS,false);
    }


    @GetMapping("/list/my/create")
    public BaseResponse<List<TeamUserVO>> myCreateTeam( TeamQuery teamQuery){
        BaseResponse<User> currentUser = loginFeign.getCurrentUser();
        User loginUser= currentUser.getData();
        if(loginUser==null)throw new BusinessException(ErrorCode.NOT_LOGIN);
        if(teamQuery==null)throw new BusinessException(ErrorCode.PARAMS_ERROR,"查询参数为空");
        Boolean isAdmin = userFeign.isAdmin(loginUser).getData();
        List<TeamUserVO> teamUserVOList=teamService.listTeam(teamQuery, loginUser, isAdmin);
        teamUserVOList=teamUserVOList.stream().filter(teamUserVO -> {
            Long createUserId = teamUserVO.getCreateUser().getId();
            if(createUserId==null)throw new BusinessException(ErrorCode.SYSTEM_ERROR,"无创建者id");
            return createUserId.equals(loginUser.getId());
        }).collect(Collectors.toList());
        return new BaseResponse<>(ErrorCode.SUCCESS,teamUserVOList);
    }


    @GetMapping("/list/my/join")
    public BaseResponse<List<TeamUserVO>> myJoinTeam(TeamQuery teamQuery){
        BaseResponse<User> currentUser = loginFeign.getCurrentUser();
        User loginUser= currentUser.getData();
        if(loginUser==null)throw new BusinessException(ErrorCode.NOT_LOGIN);
        Boolean isAdmin = userFeign.isAdmin(loginUser).getData();
        List<TeamUserVO> teamUserVOList=teamService.listTeam(teamQuery, loginUser, isAdmin);
        //过滤出我加入的队伍
        teamUserVOList=teamUserVOList.stream().filter(teamUserVO -> {
            Long teamId = teamUserVO.getId();
            if(teamId==null)throw new BusinessException(ErrorCode.SYSTEM_ERROR,"队伍id为空");
            if(teamService.hasJoin(teamId,loginUser)){
                Long createId = teamUserVO.getCreateUser().getId();
                return !createId.equals(loginUser.getId());
            }
            else return false;
        }).collect(Collectors.toList());
        return new BaseResponse<>(ErrorCode.SUCCESS,teamUserVOList);
    }

}
