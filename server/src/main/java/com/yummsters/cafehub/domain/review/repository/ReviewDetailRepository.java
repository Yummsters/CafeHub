package com.yummsters.cafehub.domain.review.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.yummsters.cafehub.domain.cafe.entity.QCafe;
import com.yummsters.cafehub.domain.member.entity.QMember;
import com.yummsters.cafehub.domain.review.dto.ReviewDetailDto;
import com.yummsters.cafehub.domain.review.entity.QReview;
import com.yummsters.cafehub.domain.tag.entity.QReviewToTag;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ReviewDetailRepository {
    private final JPAQueryFactory jpaQueryFactory;
    private final QReview review = QReview.review;
    private final QCafe cafe = QCafe.cafe;
    private final QMember member = QMember.member;
    private final QReviewToTag tag = QReviewToTag.reviewToTag;

    public ReviewDetailDto findReviewByReviewNo(Integer reviewNo) { // reviewNo로 리뷰 상세
        List<String> tagNames = this.findReviewTags(reviewNo);
        ReviewDetailDto reviewDetailDTO = jpaQueryFactory
                .select(Projections.bean(ReviewDetailDto.class,
                        review.reviewNo, review.title, review.content,
                        review.likeCount, review.regDate,
                        member.memNo, member.nickname,
                        cafe.cafeNo, cafe.cafeName, cafe.lat, cafe.lng))
                .from(review)
                .leftJoin(review.member, member)
                .leftJoin(review.cafe, cafe)
                .where(review.reviewNo.eq(reviewNo))
                .fetchOne();

        if (reviewDetailDTO != null) {
            reviewDetailDTO.setTagNames(tagNames); // tagNames를 ReviewDetailDTO에 매핑
        }

        return reviewDetailDTO;
    }

    public List<String> findReviewTags(Integer reviewNo) { // 태그 목록
        return jpaQueryFactory
                .select(tag.reviewTag.tagName)
                .from(tag)
                .where(tag.review.reviewNo.eq(reviewNo))
                .fetch();
    }
}
