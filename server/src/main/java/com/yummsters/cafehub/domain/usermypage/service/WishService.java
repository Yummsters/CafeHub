package com.yummsters.cafehub.domain.usermypage.service;

import com.yummsters.cafehub.domain.usermypage.dto.WishCafeDTO;
import com.yummsters.cafehub.domain.usermypage.dto.WishReviewDTO;

import java.util.List;

public interface WishService {
    List<WishReviewDTO> getWishReviewList(Integer memNo) throws Exception;
    List<WishCafeDTO> getWishCafeList(Integer memNo) throws Exception;
}
