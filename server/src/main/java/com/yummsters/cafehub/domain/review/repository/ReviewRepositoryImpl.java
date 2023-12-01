package com.yummsters.cafehub.domain.review.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.entity.QReview;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ReviewRepositoryImpl{
    private final JPAQueryFactory jpaQueryFactory;

    public ReviewDto findReviewByReviewNo(Integer reviewNo) {
        QReview review = QReview.review;
        ReviewDto reviewDto = jpaQueryFactory
                .select(Projections.bean(ReviewDto.class,
                        review.reviewNo, review.title, review.content,
                        review.tagName, review.thumbImg, review.likeCount, review.regDate,
                        review.member.memNo, review.member.nickname, // member 관련
                        review.cafe.cafeNo, review.cafe.cafeName, review.cafe.lat, review.cafe.lng))
                .from(review)
                .where(review.reviewNo.eq(reviewNo))
                .fetchOne();
        return reviewDto;
    }
}
