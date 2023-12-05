package com.yummsters.cafehub.domain.review.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.entity.QReview;
import com.yummsters.cafehub.domain.tag.entity.QReviewToTag;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ReviewRepositoryImpl {
    private final JPAQueryFactory jpaQueryFactory;

    public ReviewDto findReviewByReviewNo(Integer reviewNo) { // reviewNo로 리뷰 상세
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

    public List<String> findReviewTags(Integer reviewNo) {
        QReviewToTag reviewToTag = QReviewToTag.reviewToTag;
        return jpaQueryFactory
                .select(reviewToTag.reviewTag.tagName)
                .from(reviewToTag)
                .where(reviewToTag.review.reviewNo.eq(reviewNo))
                .fetch();
    }
}
