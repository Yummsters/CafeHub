package com.yummsters.cafehub.global.auth.dto;

import com.yummsters.cafehub.domain.member.entity.MemberType;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LoginReqDto {
    private String id;
    private String password;
    private MemberType memberType;

    @Builder
    public LoginReqDto(String id, String password, MemberType memberType) {
        this.id = id;
        this.password = password;
        this.memberType = memberType;
    }
}
