package com.yummsters.cafehub.domain.review.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.yummsters.cafehub.domain.review.entity.Review;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewListRes {
    // key를 위한 설정
    private Integer reviewNo;

    // 리뷰 정보
    private String thumbImg;
    private String title;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime regDate;
    private Integer likeCount;
    private String nickName;

    public static ReviewListRes reviewToReviewListRes(Review review){
        if(review == null){
            return null;
        }else {
            ReviewListRes.ReviewListResBuilder reviewListRes = ReviewListRes.builder();
            reviewListRes.reviewNo(review.getReviewNo());
            reviewListRes.thumbImg(review.getThumbImg());
            reviewListRes.title(review.getTitle());
            reviewListRes.regDate(review.getRegDate());
            reviewListRes.likeCount(review.getLikeCount());
            reviewListRes.nickName(review.getMember().getNickname());
            return reviewListRes.build();
        }
    }
}