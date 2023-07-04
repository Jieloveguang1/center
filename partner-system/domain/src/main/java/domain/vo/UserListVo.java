package domain.vo;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import domain.User;
import lombok.Data;

@Data
public class UserListVo{
   private Page<User> page;
   private Integer  totalNum;
   private Integer showPageSize;
}
