package com.yummsters.cafehub.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
