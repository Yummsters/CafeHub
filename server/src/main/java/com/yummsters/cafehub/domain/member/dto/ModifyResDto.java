package com.yummsters.cafehub.domain.member.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
public class ModifyResDto {
    private String name;
    private String email;
    private String nickname;
    private String phone;
}
