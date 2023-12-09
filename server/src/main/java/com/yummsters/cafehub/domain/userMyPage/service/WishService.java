package com.yummsters.cafehub.domain.userMyPage.service;

import com.yummsters.cafehub.domain.userMyPage.dto.WishCafeDto;
import com.yummsters.cafehub.domain.userMyPage.dto.WishReviewDto;

import java.util.List;

public interface WishService {
    List<WishReviewDto> getWishReviewList(Integer memNo) throws Exception;
    List<WishCafeDto> getWishCafeList(Integer memNo) throws Exception;
}
