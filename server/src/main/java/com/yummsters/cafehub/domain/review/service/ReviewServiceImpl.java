package com.yummsters.cafehub.domain.review.service;

import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.repository.ReviewRepository;
import com.yummsters.cafehub.domain.review.repository.ReviewRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepositoryImpl reviewRepository;

    // 선진 part ----------------------------------------------------------------------
    @Override
    public ReviewDto reviewDetail(Integer reviewNo) throws Exception {
        ReviewDto reviewDto = reviewRepository.findReviewByReviewNo(reviewNo);
        List<String> tags = reviewRepository.findReviewTags(reviewNo);
        reviewDto.setTagName(tags.toString());
        return reviewDto;
    }


    // 선진 part ----------------------------------------------------------------------

}
