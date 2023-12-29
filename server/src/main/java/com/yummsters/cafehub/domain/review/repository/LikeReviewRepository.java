package com.yummsters.cafehub.domain.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.review.entity.LikeReview;
import com.yummsters.cafehub.domain.review.entity.Review;

public interface LikeReviewRepository extends JpaRepository<LikeReview, Integer> {
    boolean existsByMember_memNoAndReview_reviewNo(Integer memNo, Integer reviewNo); // 특정 회원이 특정 리뷰를 추천했는지
    void deleteByMember_memNoAndReview_reviewNo(Integer memNo, Integer reviewNo); // 추천 취소
   List<LikeReview> findByReview(Review review);
}
