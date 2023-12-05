package com.yummsters.cafehub.domain.mypage.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.yummsters.cafehub.domain.map.entity.QCafe;
import com.yummsters.cafehub.domain.map.entity.QWishCafe;
import com.yummsters.cafehub.domain.member.entity.QMember;
import com.yummsters.cafehub.domain.mypage.dto.WishStoreDTO;
import com.yummsters.cafehub.domain.review.dto.ReviewDetailDTO;
import com.yummsters.cafehub.domain.mypage.dto.WishReviewDTO;
import com.yummsters.cafehub.domain.review.entity.QReview;
import com.yummsters.cafehub.domain.review.entity.QWishReview;
import com.yummsters.cafehub.domain.tag.entity.QReviewToTag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserRepository {
    private final JPAQueryFactory jpaQueryFactory;
    private final QReview review = QReview.review;
    private final QMember member = QMember.member;
    private final QCafe cafe = QCafe.cafe;
    private final QWishReview wishReview = QWishReview.wishReview;
    private final QWishCafe wishCafe = QWishCafe.wishCafe;


    // 찜한 리뷰 목록
    public List<WishReviewDTO> findWishReviewList(Integer memNo) {
        return jpaQueryFactory
                .select(Projections.constructor(WishReviewDTO.class,
                        review.reviewNo, review.thumbImg,
                        member.nickname, review.cafe.cafeName))
                .from(wishReview)
                .leftJoin(wishReview.member, member)
                .leftJoin(wishReview.review, review)
                .where(wishReview.member.memNo.eq(memNo))
                .fetch();
    }

    // 찜한 가게 목록
    public List<WishStoreDTO> findWishStoreList(Integer memNo) {
        return jpaQueryFactory
                .select(Projections.constructor(WishStoreDTO.class,
                        cafe.cafeNo, cafe.thumbImg, cafe.cafeName))
                .from(wishCafe)
                .leftJoin(wishCafe.cafe, cafe)
                .where(wishCafe.member.memNo.eq(memNo))
                .fetch();
    }
}
