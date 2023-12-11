package com.yummsters.cafehub.domain.userMyPage.service;

import com.yummsters.cafehub.domain.userMyPage.dto.WishCafeDto;
import com.yummsters.cafehub.domain.userMyPage.dto.WishReviewDto;
import com.yummsters.cafehub.domain.userMyPage.repository.WishCafeRepository;
import com.yummsters.cafehub.domain.userMyPage.repository.WishRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishServiceImpl implements WishService {
    private final WishRepositoryImpl wishRepository;
    @Override
    public Page<WishReviewDto> getWishReviewList(Integer memNo, Pageable pageable) throws Exception {
        return wishRepository.findWishReviewList(memNo, pageable);
    }

    @Override
    public Page<WishCafeDto> getWishCafeList(Integer memNo, Pageable pageable) throws Exception {
        return wishRepository.findWishCafeList(memNo, pageable);
    }
}
