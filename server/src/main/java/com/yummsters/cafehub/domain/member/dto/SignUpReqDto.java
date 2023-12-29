package com.yummsters.cafehub.domain.member.dto;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SignUpReqDto {
    private String id;
    private String password;
    private String name;
    private String nickname;
    private String email;
    private String phone;
}
