package com.yummsters.cafehub.domain.member.dto;

import lombok.Getter;

@Getter
public class ModifyReqDto {
    private String id;
    private String name;
    private String email;
    private String nickname;
    private String phone;
}
