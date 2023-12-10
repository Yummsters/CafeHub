package com.yummsters.cafehub.domain.cafeAd.dto;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CafeAdReqDto {
    private String description;
    private String menu;
    private String thumbImg;

    public static CafeAd cafeAdReqDto(CafeAdReqDto cafeAdReqDto, Cafe cafe){
        if(cafeAdReqDto == null){
            return null;
        }else{
            CafeAd.CafeAdBuilder cafeAd = CafeAd.builder();
            cafeAd.description(cafeAdReqDto.getDescription());
            cafeAd.menu(cafeAdReqDto.getMenu());
            cafeAd.thumbImg(cafeAdReqDto.getThumbImg());
            cafeAd.cafe(cafe);
            return cafeAd.build();
        }
    }
}