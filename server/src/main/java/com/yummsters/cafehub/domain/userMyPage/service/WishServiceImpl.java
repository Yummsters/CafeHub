package com.yummsters.cafehub.domain.userMyPage.service;

import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.userMyPage.dto.WishCafeDto;
import com.yummsters.cafehub.domain.userMyPage.dto.WishReviewDto;
import com.yummsters.cafehub.domain.userMyPage.repository.WishCafeRepository;
import com.yummsters.cafehub.domain.userMyPage.repository.WishRepositoryImpl;
import com.yummsters.cafehub.global.response.MultiResponseDto;
import com.yummsters.cafehub.global.response.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishServiceImpl implements WishService {
    private final WishRepositoryImpl wishRepository;

    @Override
    public MultiResponseDto<WishCafeDto> getWishCafeList(Integer memNo, Pageable pageable) throws Exception {
        Page<WishCafeDto> wishCafePage = wishRepository.findWishCafeList(memNo, pageable);
        return new MultiResponseDto<>(wishCafePage.getContent(), wishCafePage);
    }

    @Override
    public MultiResponseDto<WishReviewDto> getWishReviewList(Integer memNo, Pageable pageable) throws Exception {
        Page<WishReviewDto> wishReviewPage = wishRepository.findWishReviewList(memNo, pageable);
        return new MultiResponseDto<>(wishReviewPage.getContent(), wishReviewPage);
    }
}
