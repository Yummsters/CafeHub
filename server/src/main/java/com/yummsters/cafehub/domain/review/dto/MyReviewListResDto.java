package com.yummsters.cafehub.domain.review.dto;

import java.time.LocalDateTime;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.point.entity.Point;
import com.yummsters.cafehub.domain.review.entity.Review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MyReviewListResDto {
    private Integer reviewNo;
    private String title;
    private String content;
    private String tagName;
    private String thumbImg;
    private Member writer;
    private Integer likeCount;
    private LocalDateTime regDate;
    private boolean modPossible;
    private Integer reviewAuthNo;

    private Integer memNo;
    private String nickname;

    private Integer cafeNo;
    private String cafeName;
    private String lat;
    private String lng;

    private String fileurl;
    private Integer pointNo;
    private Integer pointCount;

    public void setFileurl(String fileurl) {
        this.fileurl = fileurl;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public Integer getReviewAuthNo() {
        return reviewAuthNo;
    }

    public void setReviewAuthNo(Integer reviewAuthNo) {
        this.reviewAuthNo = reviewAuthNo;
    }

    public void setPointCount(Integer pointCount) {
        this.pointCount = pointCount;
    }

    public Review toEntity() {
        return Review.builder()
                .reviewNo(reviewNo)
                .title(title)
                .content(content)
                .tagName(tagName)
                .thumbImg(thumbImg)
                .member(writer)
                .cafe(cafeNo != null ? Cafe.builder().cafeNo(cafeNo).build() : null)
                .modPossible(true)
                .likeCount(0)
                .regDate(LocalDateTime.now())
                .build();
    }

    public static MyReviewListResDto reviewToMyReviewListRes(Review review) {
        if (review == null) {
            return null;
        } else {
            MyReviewListResDto.MyReviewListResDtoBuilder reviewListRes = MyReviewListResDto.builder();

            reviewListRes.thumbImg(review.getThumbImg());
            reviewListRes.content(review.getContent());
            reviewListRes.regDate(review.getRegDate());
            reviewListRes.reviewNo(review.getReviewNo());
            reviewListRes.title(review.getTitle());
            reviewListRes.likeCount(review.getLikeCount());

            // 작성자 정보
            if (review.getMember() != null) {
                reviewListRes.memNo(review.getMember().getMemNo());
                reviewListRes.nickname(review.getMember().getNickname());
            }

            // 카페 정보
            if (review.getCafe() != null) {
                reviewListRes.cafeNo(review.getCafe().getCafeNo());
                reviewListRes.cafeName(review.getCafe().getCafeName());
                reviewListRes.lat(review.getCafe().getLat());
                reviewListRes.lng(review.getCafe().getLng());
            }

            // 기타 필요한 정보들 추가...

            return reviewListRes.build();
        }
    }
}
