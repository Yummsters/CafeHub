package com.yummsters.cafehub.domain.member.dto;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SignUpStoreDto {
	private Integer cafeNo;
	private String cafeName;
    private String tel;
    private String businessNo;
    private String address;
    private String operTime;
    private String thumbImg;
    private Integer fileNum;
   
//    private String fileurl;
//    public void setFileurl(String fileurl) {
//		this.fileurl = fileurl;
//	}
    public SignUpStoreDto(Integer cafeNo, String cafeName, String tel, String businessNo, String address, String operTime, String thumbImg, Integer fileNum, String fileurl) {
        this.cafeNo = cafeNo;
        this.cafeName = cafeName;
        this.tel = tel;
        this.businessNo = businessNo;
        this.address = address;
        this.operTime = operTime;
        this.thumbImg = thumbImg;
        this.fileNum = fileNum;
        
    }
	 
}
