package com.yummsters.cafehub.domain.review.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.yummsters.cafehub.domain.review.entity.Review;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserReviewListDto {
    // key를 위한 설정
    private Integer reviewNo;

    // 리뷰 정보
    private String thumbImg;
    private String title;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime regDate;
    private Integer likeCount;

    // 카페 정보
    private String cafeName;

    public static UserReviewListDto reviewToUserReviewListDto(Review review){
        if(review == null){
            return null;
        }else {
            UserReviewListDto.UserReviewListDtoBuilder userReviewList = UserReviewListDto.builder();
            userReviewList.reviewNo(review.getReviewNo());
            userReviewList.thumbImg(review.getThumbImg());
            userReviewList.title(review.getTitle());
            userReviewList.regDate(review.getRegDate());
            userReviewList.likeCount(review.getLikeCount());
            userReviewList.cafeName(review.getCafe().getCafeName());
            return userReviewList.build();
        }
    }
}