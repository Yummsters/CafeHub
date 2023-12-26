package com.yummsters.cafehub.domain.member.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SignUpStoreDto {
	
	private String cafeName;
    private String tel;
    private String businessNo;
    private String address;
    private String operTime;
    private String lat;
    private String lng;
    private String tagName;
}
