package com.yummsters.cafehub.global.auth.oauth2;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.entity.MemberType;
import com.yummsters.cafehub.domain.member.entity.Social;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.point.entity.Point;
import com.yummsters.cafehub.domain.point.repository.PointRepository;
import com.yummsters.cafehub.global.auth.userdetails.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PrincipalOauth2UserService  extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final PointRepository pointRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        return pricessOAuth2User(userRequest, oAuth2User);
    }

    private OAuth2User pricessOAuth2User(OAuth2UserRequest userRequest,OAuth2User oAuth2User) throws OAuth2AuthenticationException{
        OAuth2MemberInfo oAuth2MemberInfo = null;
        if(userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
            oAuth2MemberInfo = new NaverMemberInfo(oAuth2User.getAttribute("response"));
        } else if(userRequest.getClientRegistration().getRegistrationId().equals("kakao")) {
            oAuth2MemberInfo = new KakaoMemberInfo(oAuth2User.getAttributes());
        } else {
            System.out.println("네이버와 카카오만 지원합니다");
        }

        // 회원가입 여부 확인
        Member member = memberRepository.findById(oAuth2MemberInfo.getProvider()+oAuth2MemberInfo.getProviderId());

        if(member == null && memberRepository.existsByEmail(oAuth2MemberInfo.getEmail())){
            throw new OAuth2AuthenticationException(new OAuth2Error("존재 회원"), "존재 회원");
        }else if(member == null && memberRepository.existsByNickname(oAuth2MemberInfo.getNickname())){
            throw new OAuth2AuthenticationException(new OAuth2Error("존재 닉네임"), "존재 닉네임");
        }else if(member == null){
            member = Member.builder()
                    .id(oAuth2MemberInfo.getProvider()+oAuth2MemberInfo.getProviderId())
                    .password(oAuth2MemberInfo.getProvider()+" 로그인 유저")
                    .name(oAuth2MemberInfo.getProvider().equals("kakao") ? oAuth2MemberInfo.getNickname() : oAuth2MemberInfo.getName())
                    .nickname(oAuth2MemberInfo.getNickname())
                    .email(oAuth2MemberInfo.getEmail())
                    .status(true)
                    .memberType(MemberType.USER)
                    .social(oAuth2MemberInfo.getProvider().equals("kakao") ? Social.KAKAO : Social.NAVER)
                    .badgeNo(9)
                    .phone(oAuth2MemberInfo.getProvider()+" 로그인 유저")
                    .build();

            memberRepository.save(member);

            // 포인트 정보 생성
            Point point = Point.builder()
                    .member(member)
                    .build();
            pointRepository.save(point);
        }

        return new PrincipalDetails(member, oAuth2User.getAttributes());
    }
}
