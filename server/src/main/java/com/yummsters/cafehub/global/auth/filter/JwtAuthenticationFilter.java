package com.yummsters.cafehub.global.auth.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.member.dto.CafeTokenResDto;
import com.yummsters.cafehub.domain.member.dto.TokenResDto;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.entity.MemberType;
import com.yummsters.cafehub.domain.member.mapper.MemberMapper;
import com.yummsters.cafehub.global.auth.dto.LoginReqDto;
import com.yummsters.cafehub.global.auth.jwt.JwtProvider;
import com.yummsters.cafehub.global.auth.userdetails.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Date;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final MemberMapper mapper;
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        ObjectMapper mapper = new ObjectMapper();
        LoginReqDto loginReqDto = null;
        try{
            loginReqDto = mapper.readValue(request.getInputStream(), LoginReqDto.class);
        }catch (IOException e) {
            e.printStackTrace();
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginReqDto.getId(), loginReqDto.getPassword());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        Member member = principalDetails.getMember();
        String dbMemberType = member.getMemberType().toString();

        // 탈퇴 회원 로그인 불가
        if(!member.isStatus()){
            try {
                response.sendError(880, "탈퇴 회원입니다.");
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        if(member.getMemberType().equals(MemberType.MANAGER)){
            return authentication;
        }
        // 사용자, 사장님에 따른 로그인 구분
        if (!dbMemberType.equals(loginReqDto.getMemberType().toString())) {
            try {
                if (dbMemberType.equals("USER")) {
                    response.sendError(991, "사장님이 아닙니다. 사용자 로그인을 이용하세요.");
                } else {
                    response.sendError(990, "사용자가 아닙니다. 사장님 로그인을 이용하세요.");
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }


        return authentication;
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        // 토큰 생성을 위해 Authentication에서 정보 가져오기
        PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();

        String accessToken = JWT.create()
                .withSubject(principalDetails.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis()+ JwtProvider.EXPIRATION_TIME))
                .withClaim("id", principalDetails.getUsername())
                .sign(Algorithm.HMAC256(JwtProvider.SECRET));

        String refreshToken = JWT.create()
                .withSubject(principalDetails.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis()+ JwtProvider.EXPIRATION_TIME*10))
                .withClaim("id", principalDetails.getUsername())
                .sign(Algorithm.HMAC256(JwtProvider.SECRET));

        // token 헤더에 허용하기 위한 설정
        response.addHeader("Access-Control-Expose-Headers", JwtProvider.REFRESH_STRING);
        response.addHeader(JwtProvider.HEADER_STRING, JwtProvider.TOKEN_PREFIX+accessToken);
        response.addHeader(JwtProvider.REFRESH_STRING, JwtProvider.TOKEN_PREFIX+refreshToken);

        // member
        Member member = principalDetails.getMember();
        TokenResDto responseMember = mapper.memberToTokenResDto(member);

        // cafe
        Cafe cafe = principalDetails.getMember().getCafe();
        CafeTokenResDto responseCafe = CafeTokenResDto.cafeToCafeTokenResDto(cafe);

        // ResponseEntity로 응답
        ObjectMapper objectMapper = new ObjectMapper();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("member", responseMember);
        responseData.put("cafe", responseCafe);
        response.getWriter().write(objectMapper.writeValueAsString(responseData));

    }
}
