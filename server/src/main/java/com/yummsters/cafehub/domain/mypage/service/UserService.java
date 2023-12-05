package com.yummsters.cafehub.domain.mypage.service;

import com.yummsters.cafehub.domain.mypage.dto.WishReviewDTO;

import java.util.List;

public interface UserService {
    // 선진 part ----------------------------------------------------------------------
    List<WishReviewDTO> getWishReviewList(Integer memNo) throws Exception; // 리뷰 찜 목록

    // 선진 part ----------------------------------------------------------------------
}
