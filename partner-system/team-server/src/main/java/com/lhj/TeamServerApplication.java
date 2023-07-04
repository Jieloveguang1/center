package com.lhj;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@MapperScan("com.lhj.mapper")
@EnableFeignClients
public class TeamServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeamServerApplication.class, args);
    }

}
