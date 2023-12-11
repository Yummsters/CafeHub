package com.yummsters.cafehub.domain.review.dto;

import java.time.LocalDateTime;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.review.entity.ReviewAuth;

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

public class ReviewAuthDto {
	  private Integer reviewAuthNo;
	    private LocalDateTime regDate;
	    private Integer memNo;
	    private Integer cafeNo;
	  //  private String cafeName;
	   
	    public static ReviewAuthDto fromEntity(ReviewAuth reviewAuth) {
	        return ReviewAuthDto.builder()
	                .reviewAuthNo(reviewAuth.getReviewAuthNo())
	                .regDate(reviewAuth.getRegDate())
	                .memNo(reviewAuth.getMember().getMemNo())
	                .cafeNo(reviewAuth.getCafe().getCafeNo())
	               // .cafeName(reviewAuth.getCafe().getCafeName())
	                .build();
	    }
}
