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

public class ReviewDto {
	private Integer reviewNo;
	private String title;
	private String content;
	private String tagName;
	private String thumbImg;
	private Member writer;
	private Integer likeCount;
	private LocalDateTime regDate;
	private boolean modPossible; // 리뷰 수정 가능 여부
    private Integer reviewAuthNo;  // 리뷰 권한 번호

	// Member 정보
	private Integer memNo;  // Member의 PK 혹은 외래키
	private String nickname;  // Member의 이름 등

	// Cafe 정보
	private Cafe cafeNo;  // Cafe의 PK 혹은 외래키
	private String cafeName;  // Cafe의 이름
	private String lat;
	private String lng;
  
	private String fileurl;
	
	private Point pointNo;
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
		            .cafe(cafeNo)
				 .modPossible(true)
		            .likeCount(0)
		            .regDate(LocalDateTime.now())
		            .build();
	}

}
