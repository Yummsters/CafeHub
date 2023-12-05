package com.yummsters.cafehub.domain.mypage.service;

import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.mypage.dto.WishReviewDTO;
import com.yummsters.cafehub.domain.mypage.dto.WishStoreDTO;
import com.yummsters.cafehub.domain.mypage.repository.UserRepository;
import com.yummsters.cafehub.domain.review.repository.*;
import com.yummsters.cafehub.domain.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository dslRepository;

    @Override
    public List<WishReviewDTO> getWishReviewList(Integer memNo) throws Exception {
        return dslRepository.findWishReviewList(memNo);
    }

    @Override
    public List<WishStoreDTO> getWishStoreList(Integer memNo) throws Exception {
        return dslRepository.findWishStoreList(memNo);
    }

    // 선진 part ----------------------------------------------------------------------
}
