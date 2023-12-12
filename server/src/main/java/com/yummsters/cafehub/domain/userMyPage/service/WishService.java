package com.yummsters.cafehub.domain.userMyPage.service;

import com.yummsters.cafehub.domain.userMyPage.dto.WishCafeDto;
import com.yummsters.cafehub.domain.userMyPage.dto.WishReviewDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface WishService {
    Page<WishReviewDto> getWishReviewList(Integer memNo, Pageable pageable) throws Exception;
    Page<WishCafeDto> getWishCafeList(Integer memNo, Pageable pageable) throws Exception;
}
