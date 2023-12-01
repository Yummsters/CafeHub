package com.yummsters.cafehub.domain.review.service;

import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.repository.ReviewRepository;
import com.yummsters.cafehub.domain.review.repository.ReviewRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepositoryImpl reviewRepository;

    // 선진 part ----------------------------------------------------------------------
    @Override
    public ReviewDto reviewDetail(Integer reviewNo) throws Exception {
        return reviewRepository.findReviewByReviewNo(reviewNo);
    }


    // 선진 part ----------------------------------------------------------------------

}
