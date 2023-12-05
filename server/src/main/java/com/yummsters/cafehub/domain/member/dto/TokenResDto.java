package com.yummsters.cafehub.domain.member.dto;

import com.yummsters.cafehub.domain.member.entity.MemberType;
import com.yummsters.cafehub.domain.member.entity.Social;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenResDto {
    private Integer memNo;
    private String name;
    private String nickname;
    private String email;
    private Social social;
    private boolean status;
    private MemberType memberType;
}
