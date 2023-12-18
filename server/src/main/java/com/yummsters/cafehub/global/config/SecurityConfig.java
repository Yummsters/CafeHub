package com.yummsters.cafehub.global.config;

import com.yummsters.cafehub.domain.member.mapper.MemberMapper;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.global.auth.filter.JwtAuthenticationFilter;
import com.yummsters.cafehub.global.auth.filter.JwtAuthorizationFilter;
import com.yummsters.cafehub.global.auth.oauth2.OAuth2LoginSuccessHandler;
import com.yummsters.cafehub.global.auth.oauth2.PrincipalOauth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.filter.CorsFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final MemberRepository memberRepository;
    private final CorsFilter corsFilter;
    private final MemberMapper memberMapper;
    private final PrincipalOauth2UserService principalOauth2UserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

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
                .addFilter(new JwtAuthenticationFilter(authenticationManager(), memberMapper)) // 로그인 시에만 호출되는 필터
                .addFilter(new JwtAuthorizationFilter(authenticationManager(), memberRepository))
                .oauth2Login()
                .authorizationEndpoint().baseUri("/oauth2/authorization")  // 소셜 로그인 url
                .and()
                .redirectionEndpoint().baseUri("/oauth2/callback/*")  // 소셜 인증 후 redirect url
                .and()
                .userInfoEndpoint().userService(principalOauth2UserService)  // 회원 정보 처리
                .and()
                .successHandler(oAuth2LoginSuccessHandler)
                .and()
                .authorizeRequests()
                .antMatchers("/member/**").access("hasRole('STORE') or hasRole('USER') or hasRole('MANAGER')") // 권한 부여 확인용 임시 코드
                .antMatchers("/user/**").access("hasRole('USER') or hasRole('MANAGER')")
                .antMatchers("/store/**").access("hasRole('STORE') or hasRole('MANAGER')")
                .antMatchers("/manager/**").access("hasRole('MANAGER')")
                .anyRequest().permitAll();
    }
}