package com.yummsters.cafehub.global.config;

import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.global.auth.filter.JwtAuthenticationFilter;
import com.yummsters.cafehub.global.auth.filter.JwtAuthorizationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private CorsFilter corsFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncode(){
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.addFilter(corsFilter)
                .csrf().disable() // csrf 공격 차단
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 세션 비활성화
                .and()
                .formLogin().disable() // 로그인 폼 비활성화
                .httpBasic().disable()
                .addFilter(new JwtAuthenticationFilter(authenticationManager())) // 로그인 시에만 호출되는 필터
                .addFilter(new JwtAuthorizationFilter(authenticationManager(), memberRepository))
                .authorizeRequests()
                .anyRequest().permitAll();
    }
}
