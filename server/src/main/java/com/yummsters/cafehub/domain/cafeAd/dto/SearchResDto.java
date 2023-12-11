package com.yummsters.cafehub.domain.cafeAd.dto;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SearchResDto {
    private String thumbImg;
    private String description;
    private String menu;
    private boolean isApproved;

    public static SearchResDto CafeAdToSearchResDto(CafeAd cafeAd){
        if(cafeAd == null){
            return null;
        }else {
            SearchResDto.SearchResDtoBuilder searchResDto = SearchResDto.builder();
            searchResDto.thumbImg(cafeAd.getThumbImg());
            searchResDto.description(cafeAd.getDescription());
            searchResDto.menu(cafeAd.getMenu());
            searchResDto.isApproved(cafeAd.isApproved());
            return searchResDto.build();
        }
    }
}