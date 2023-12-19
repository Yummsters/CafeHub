package com.yummsters.cafehub.global.auth.filter;

import com.auth0.jwt.exceptions.TokenExpiredException;
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
import java.sql.Date;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

    private MemberRepository memberRepository;

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, MemberRepository memberRepository){
        super(authenticationManager);
        this.memberRepository = memberRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String access = request.getHeader(JwtProvider.HEADER_STRING);
        String refresh = request.getHeader(JwtProvider.REFRESH_STRING);

        if(access == null || !access.startsWith(JwtProvider.TOKEN_PREFIX)){
            chain.doFilter(request, response);
            return;
        }

        String accessToken = access.replace(JwtProvider.TOKEN_PREFIX, "");

        String accessId = null;
        String refreshId = null;

        try{
            // accessToken 검증
            accessId = JWT.require(Algorithm.HMAC256(JwtProvider.SECRET)).build().verify(accessToken)
                    .getClaim("id").asString();
        } catch (TokenExpiredException e) {
            // accessToken 만료 >> 재발급 진행
            System.out.println("에세스 토큰 만료");
            try{
                // refreshToken 검증
                String refreshToken = refresh.replace(JwtProvider.TOKEN_PREFIX, "");
                refreshId = JWT.require(Algorithm.HMAC256(JwtProvider.SECRET)).build().verify(refreshToken)
                        .getClaim("id").asString();
            }catch (TokenExpiredException et) {
                // refresh 토큰 만료
                System.out.println("리프레시 토큰 만료");
                response.sendError(602, "REFRESH_EXPIRED");
                return;
            } catch (Exception et) {
                response.sendError(603, "ERROR");
                return;
            }

            String newAccess = creatToken(response, refreshId);// 새로운 토큰 생성
            String checkAccess =   JWT.require(Algorithm.HMAC256(JwtProvider.SECRET)).build().verify(newAccess)
                    .getClaim("id").asString();

            if(checkAccess != null){
                Member member = memberRepository.findById(checkAccess);
                System.out.println(member);
                PrincipalDetails principalDetails = new PrincipalDetails(member);
                Authentication authentication = new UsernamePasswordAuthenticationToken
                        (principalDetails, null, principalDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            chain.doFilter(request, response);

            return;
        } catch (Exception e) {
            response.sendError(601, "ERROR");
            return;
        }

        if(accessId != null){
            Member member = memberRepository.findById(accessId);
            PrincipalDetails principalDetails = new PrincipalDetails(member);
            Authentication authentication = new UsernamePasswordAuthenticationToken
                    (principalDetails, null, principalDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        chain.doFilter(request, response);
    }

    // 토큰 재생성
    private String creatToken(HttpServletResponse response, String refreshId){
        Member member = memberRepository.findById(refreshId);

        String accessToken = JWT.create()
                .withSubject(member.getId())
                .withExpiresAt(new Date(System.currentTimeMillis()+ JwtProvider.EXPIRATION_TIME))
                .withClaim("id", member.getId())
                .sign(Algorithm.HMAC256(JwtProvider.SECRET));

        String refreshToken = JWT.create()
                .withSubject(member.getId())
                .withExpiresAt(new Date(System.currentTimeMillis()+ JwtProvider.EXPIRATION_TIME*10))
                .withClaim("id", member.getId())
                .sign(Algorithm.HMAC256(JwtProvider.SECRET));

        // token 헤더에 허용하기 위한 설정
        response.addHeader("Access-Control-Expose-Headers", JwtProvider.REFRESH_STRING);
        response.addHeader(JwtProvider.HEADER_STRING, JwtProvider.TOKEN_PREFIX+accessToken);
        response.addHeader(JwtProvider.REFRESH_STRING, JwtProvider.TOKEN_PREFIX+refreshToken);

        return accessToken;
    }
}
