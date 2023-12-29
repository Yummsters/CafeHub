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
    
    public SignUpStoreDto( String cafeName, String tel, String businessNo, String address, String operTime, String thumbImg, Integer fileNum, String fileurl, String lat, String lng, String tagName) {

        this.cafeName = cafeName;
        this.tel = tel;
        this.businessNo = businessNo;
        this.address = address;
        this.operTime = operTime;
        this.lat = lat;
        this.lng = lng;
        this.tagName = tagName;


    }
}
