package com.yummsters.cafehub.domain.member.dto;

import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchPwDto {
    private String id;
    private String phone;
    private String password;
}
