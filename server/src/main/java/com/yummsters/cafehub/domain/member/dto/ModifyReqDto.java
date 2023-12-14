package com.yummsters.cafehub.domain.member.dto;

import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
public class ModifyReqDto {
    private String id;
    private String name;
    private String email;
    private String nickname;
    private String phone;
}
