package com.yummsters.cafehub.domain.cafe.dto;

import java.time.LocalDateTime;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ModifyCafeDto {
	private Integer cafeNo;
    private String cafeName;
    private String tel;
    private String businessNo;
    private String address;
    private String operTime;
    private String thumbImg;
    private String tagName;
    private String lat;
    private String lng;
    private boolean isPaid;
    private LocalDateTime paidDate;
    private boolean isExisting;
    private String cafeInfo;
    

    private String fileurl;

    public void setFileurl(String fileurl) {
        this.fileurl = fileurl;
    }
    
    public Cafe toEntity() {

		 return Cafe.builder()
				    .cafeNo(cafeNo)
		            .cafeName(cafeName)
		            .tel(tel)
		            .businessNo(businessNo)
		            .address(address)
		            .operTime(operTime)
		            .thumbImg(thumbImg)
		            .tagName(tagName)
		            .lat(lat)
		            .lng(lng)
		            .build();
	}
}
