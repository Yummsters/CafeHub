package com.yummsters.cafehub.domain.review.repository;

import com.yummsters.cafehub.domain.review.entity.WishReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishReviewRepository extends JpaRepository<WishReview, Integer> {
    boolean existsByMember_memNoAndReview_reviewNo(Integer memNo, Integer reviewNo); // 특정 회원이 특정 리뷰를 찜 했는지
    void deleteByMember_memNoAndReview_reviewNo(Integer memNo, Integer reviewNo); // 찜 취소
}