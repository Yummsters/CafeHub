package com.yummsters.cafehub.domain.cafeAd.dto;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CafeAdReqDto {
    private String description;
    private String menu;

    public static CafeAd cafeAdReqDto(CafeAdReqDto cafeAdReqDto, Cafe cafe){
        if(cafeAdReqDto == null){
            return null;
        }else{
            CafeAd.CafeAdBuilder cafeAd = CafeAd.builder();
            cafeAd.description(cafeAdReqDto.getDescription());
            cafeAd.menu(cafeAdReqDto.getMenu());
            cafeAd.cafe(cafe);
            cafeAd.regDate(LocalDateTime.now());
            return cafeAd.build();
        }
    }
}