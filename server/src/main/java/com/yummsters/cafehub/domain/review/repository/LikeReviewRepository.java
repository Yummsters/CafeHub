package com.yummsters.cafehub.domain.review.repository;

import com.yummsters.cafehub.domain.review.entity.LikeReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeReviewRepository extends JpaRepository<LikeReview, Integer> {
    boolean existsByMember_memNoAndReview_reviewNo(Integer memNo, Integer reviewNo); // 특정 회원이 특정 리뷰를 추천했는지
    void deleteByMember_memNoAndReview_reviewNo(Integer memNo, Integer reviewNo); // 추천 취소
}
