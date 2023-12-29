package com.yummsters.cafehub.domain.member.dto;

import lombok.Data;

@Data
public class ModifyResDto {
    private String name;
    private String email;
    private String nickname;
    private String phone;
}
