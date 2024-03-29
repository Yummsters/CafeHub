package com.yummsters.cafehub.global.auth.oauth2;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.yummsters.cafehub.global.auth.jwt.JwtProvider;
import com.yummsters.cafehub.global.auth.userdetails.PrincipalDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

@Component
public class OAuth2LoginSuccessHandler  implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        try{
            // 탈퇴 회원인 경우
            if(!principalDetails.getMember().isStatus()){
                throw new Exception("탈퇴한 회원입니다.");
            }else{
                // 탈퇴 회원이 아닌 경우
                String accessToken = JWT.create()
                        .withSubject(principalDetails.getUsername())
                        .withExpiresAt(new Date(System.currentTimeMillis() + JwtProvider.EXPIRATION_TIME))
                        .withClaim("id", principalDetails.getMember().getId())
                        .sign(Algorithm.HMAC256(JwtProvider.SECRET));

                String refreshToken = JWT.create()
                        .withSubject(principalDetails.getUsername())
                        .withExpiresAt(new Date(System.currentTimeMillis() + JwtProvider.EXPIRATION_TIME*6*24))
                        .withClaim("id", principalDetails.getMember().getId())
                        .sign(Algorithm.HMAC256(JwtProvider.SECRET));

                // 토큰을 가지고 리액트로 다시 리턴
                response.setCharacterEncoding("UTF-8");
                String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/redirect/"
                                + JwtProvider.TOKEN_PREFIX + accessToken +"/" + JwtProvider.TOKEN_PREFIX + refreshToken)
                        .build().toUriString();
                response.sendRedirect(targetUrl);
            }
        } catch (Exception e) {
            response.sendRedirect("http://localhost:3000/oauth2Error/880");
        }
    }
}