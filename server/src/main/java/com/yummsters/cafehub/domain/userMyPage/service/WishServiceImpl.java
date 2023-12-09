package com.yummsters.cafehub.domain.userMyPage.service;

import com.yummsters.cafehub.domain.userMyPage.dto.WishCafeDto;
import com.yummsters.cafehub.domain.userMyPage.dto.WishReviewDto;
import com.yummsters.cafehub.domain.userMyPage.repository.WishRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishServiceImpl implements WishService {
    private final WishRepositoryImpl wishRepository;
    @Override
    public List<WishReviewDto> getWishReviewList(Integer memNo) throws Exception {
        return wishRepository.findWishReviewList(memNo);
    }

    @Override
    public List<WishCafeDto> getWishCafeList(Integer memNo) throws Exception {
        return wishRepository.findWishCafeList(memNo);
    }
}
