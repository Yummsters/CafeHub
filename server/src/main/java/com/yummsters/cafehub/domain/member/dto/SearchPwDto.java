package com.yummsters.cafehub.domain.member.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchPwDto {
    private String id;
    private String phone;
    private String password;
}
