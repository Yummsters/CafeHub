package com.yummsters.cafehub.domain.member.dto;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CafeTokenResDto {
    private Integer cafeNo;
    private String cafeName;
    private String thumbImg;
    private String address;
    private boolean isPaid;
    private LocalDateTime paidDate;

    public static CafeTokenResDto cafeToCafeTokenResDto(Cafe cafe){
        if(cafe == null){
            return null;
        }else {
            CafeTokenResDto.CafeTokenResDtoBuilder cafeResponse = CafeTokenResDto.builder();
            cafeResponse.cafeNo(cafe.getCafeNo());
            cafeResponse.cafeName(cafe.getCafeName());
            cafeResponse.thumbImg(cafe.getThumbImg());
            cafeResponse.address(cafe.getAddress());
            cafeResponse.isPaid(cafe.isPaid());
            cafeResponse.paidDate(cafe.getPaidDate());
            return cafeResponse.build();
        }
    }
}