package com.yummsters.cafehub.domain.cafeAd.dto;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.payment.entity.Payment;
import lombok.Builder;
import lombok.Getter;

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
            return cafeAd.build();
        }
    }
}