package com.yummsters.cafehub.domain.userMyPage.service;

import com.yummsters.cafehub.domain.userMyPage.dto.WishCafeDTO;
import com.yummsters.cafehub.domain.userMyPage.dto.WishReviewDTO;

import java.util.List;

public interface WishService {
    List<WishReviewDTO> getWishReviewList(Integer memNo) throws Exception;
    List<WishCafeDTO> getWishCafeList(Integer memNo) throws Exception;
}
