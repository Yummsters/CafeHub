package com.yummsters.cafehub.domain.userMyPage.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.yummsters.cafehub.domain.cafe.entity.QCafe;
import com.yummsters.cafehub.domain.member.entity.QMember;
import com.yummsters.cafehub.domain.review.entity.QReview;
import com.yummsters.cafehub.domain.userMyPage.dto.WishCafeDto;
import com.yummsters.cafehub.domain.userMyPage.dto.WishReviewDto;
import com.yummsters.cafehub.domain.userMyPage.entity.QWishCafe;
import com.yummsters.cafehub.domain.userMyPage.entity.QWishReview;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class WishRepositoryImpl {
    private final JPAQueryFactory jpaQueryFactory;
    private final QWishCafe wishCafe = QWishCafe.wishCafe;
    private final QWishReview wishReview = QWishReview.wishReview;
    private final QCafe cafe = QCafe.cafe;
    private final QMember member = QMember.member;
    private final QReview review = QReview.review;

    public List<WishCafeDto> findWishCafeList(Integer memNo) {
        return jpaQueryFactory
                .select(Projections.constructor(WishCafeDto.class,
                        cafe.cafeNo, cafe.thumbImg, cafe.cafeName))
                .from(wishCafe)
                .leftJoin(wishCafe.cafe, cafe)
                .where(wishCafe.member.memNo.eq(memNo))
                .fetch();
    }

    public List<WishReviewDto> findWishReviewList(Integer memNo) {
        return jpaQueryFactory
                .select(Projections.constructor(WishReviewDto.class,
                        review.reviewNo, review.thumbImg,
                        member.memNo, member.nickname, review.cafe.cafeName))
                .from(wishReview)
                .leftJoin(wishReview.member, member)
                .leftJoin(wishReview.review, review)
                .where(wishReview.member.memNo.eq(memNo))
                .fetch();
    }
}
