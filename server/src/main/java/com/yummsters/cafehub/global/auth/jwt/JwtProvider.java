package com.yummsters.cafehub.global.auth.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

public interface JwtProvider {
    String SECRET = "코스타"; // 서버 고유의 비밀키
    int EXPIRATION_TIME = 1000*60*10*3; // 1000이 1초 >> 10분 (토큰 만료 시간 설정)
    String TOKEN_PREFIX = "Bearer ";
    String HEADER_STRING = "Authorization";
    String REFRESH_STRING = "Refresh";
}