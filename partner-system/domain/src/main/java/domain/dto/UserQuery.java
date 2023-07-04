package domain.dto;

import lombok.Data;

import java.util.List;


/**
 * 队伍查询封装类
 */
@Data
public class UserQuery {
    /**
     * id
     */
    private Long id;

    /**
     * id 列表
     */
    private List<Long> idList;

    /**
     * 搜索关键词（同时对队伍名称和描述搜索）
     */
    private String searchText;

    /**
     * 用户名称
     */
    private String username;


    /**
     * 性别
     */
    private Integer gender;

    /**
     * 账号
     */
    private String userAccount;

    /**
     * 标签
     */
    private List<String> tagsName;

    /**
     * 当前页码
     */
    private Integer currentPage;

    /**
     * 当前页展示的数据条数
     */
    private Integer pageSize;
}
