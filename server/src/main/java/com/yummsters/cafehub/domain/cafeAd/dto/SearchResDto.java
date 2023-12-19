package com.yummsters.cafehub.domain.cafeAd.dto;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.review.entity.FileVo;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SearchResDto {
    private FileVo fileVo;
    private String description;
    private String menu;
    private boolean isApproved;
    private String paymentKey;

    public static SearchResDto CafeAdToSearchResDto(CafeAd cafeAd){
        if(cafeAd == null){
            return null;
        }else {
            SearchResDto.SearchResDtoBuilder searchResDto = SearchResDto.builder();
            searchResDto.description(cafeAd.getDescription());
            searchResDto.menu(cafeAd.getMenu());
            searchResDto.isApproved(cafeAd.isApproved());
            searchResDto.fileVo(cafeAd.getFileVo());
            if (cafeAd.getPayment() != null) {
                searchResDto.paymentKey(cafeAd.getPayment().getPaymentKey());
            }
            return searchResDto.build();
        }
    }
}