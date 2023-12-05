package com.yummsters.cafehub.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Builder
public class SignUpReqDto {
    private String id;
    private String password;
    private String name;
    private String nickname;
    private String email;
    private String phone;
}
