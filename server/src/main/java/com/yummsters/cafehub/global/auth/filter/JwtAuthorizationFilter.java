package com.yummsters.cafehub.global.auth.filter;

import io.jsonwebtoken.*;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.global.auth.jwt.JwtProvider;
import com.yummsters.cafehub.global.auth.userdetails.PrincipalDetails;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

    private MemberRepository memberRepository;

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, MemberRepository memberRepository){
        super(authenticationManager);
        this.memberRepository = memberRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String header = request.getHeader(JwtProvider.HEADER_STRING);

        if(header == null || !header.startsWith(JwtProvider.TOKEN_PREFIX)){
            chain.doFilter(request, response);
            return;
        }

        String accessToken = header.replace(JwtProvider.TOKEN_PREFIX, "");
        String id = null;
        try{
            id = JWT.require(Algorithm.HMAC256(JwtProvider.SECRET)).build().verify(accessToken)
                    .getClaim("id").asString();
        } catch (ExpiredJwtException e) {
            response.sendError(501, "TOKEN_EXPIRED");
        } catch (Exception e) {
            response.sendError(502, "ERROR");
        }

        if(id != null){
            Member member = memberRepository.findById(id);
            PrincipalDetails principalDetails = new PrincipalDetails(member);
            Authentication authentication = new UsernamePasswordAuthenticationToken
                    (principalDetails, null, principalDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        chain.doFilter(request, response);
    }
}
