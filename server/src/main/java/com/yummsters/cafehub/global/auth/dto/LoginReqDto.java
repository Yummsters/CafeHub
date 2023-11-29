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

    @Builder
    public LoginReqDto(String id, String password) {
        this.id = id;
        this.password = password;
    }
}
