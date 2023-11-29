package com.yummsters.cafehub.domain.member.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignUpResDto {
    private Integer memNo;
    private String id;
    private String name;
    private String nickname;
    private String email;
    private String phone;
}
