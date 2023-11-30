package com.yummsters.cafehub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication(scanBasePackages = {"com.yummsters.cafehub.domain.member.mapper.MemberMapper"})
public class CafehubApplication {

	public static void main(String[] args) {
		SpringApplication.run(CafehubApplication.class, args);
	}

}
