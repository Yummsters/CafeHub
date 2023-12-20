package com.yummsters.cafehub.global.auth.oauth2;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@Component
public class OAuth2LoginFailHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        System.out.println(exception.getMessage());
        exception.printStackTrace();
        if(Objects.equals(exception.getMessage(), "존재 회원")){
            response.sendRedirect("http://localhost:3000/oauth2Error/881");
        }else if(Objects.equals(exception.getMessage(), "존재 닉네임")){
            response.sendRedirect("http://localhost:3000/oauth2Error/882");
        }
    }
}