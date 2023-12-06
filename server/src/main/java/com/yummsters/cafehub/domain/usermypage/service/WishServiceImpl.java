package com.yummsters.cafehub.domain.usermypage.service;

import com.yummsters.cafehub.domain.usermypage.dto.WishCafeDTO;
import com.yummsters.cafehub.domain.usermypage.dto.WishReviewDTO;
import com.yummsters.cafehub.domain.usermypage.repository.WishRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishServiceImpl implements WishService {
    private final WishRepositoryImpl wishRepository;
    @Override
    public List<WishReviewDTO> getWishReviewList(Integer memNo) throws Exception {
        return wishRepository.findWishReviewList(memNo);
    }

    @Override
    public List<WishCafeDTO> getWishCafeList(Integer memNo) throws Exception {
        return wishRepository.findWishCafeList(memNo);
    }
}
