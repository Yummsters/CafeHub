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
	    private String cafeName;
		private boolean writeAuth;
		private Integer remainTime;
	   
	    public void setCafeName(String cafeName) {
	        this.cafeName = cafeName;
	    }
	    
	    public static ReviewAuthDto fromEntity(ReviewAuth reviewAuth) {
	        return ReviewAuthDto.builder()
	                .reviewAuthNo(reviewAuth.getReviewAuthNo())
	                .regDate(reviewAuth.getRegDate())
					//.writeAuth(reviewAuth.getRegDate().plusDays(7).isBefore(LocalDateTime.now())) // regDate에서 7일을 더한 일자가 현재보다 이전 시간이라면 true / 아니라면 false
					.remainTime(reviewAuth.getRegDate().plusDays(7).getDayOfYear()-LocalDateTime.now().getDayOfYear()) // regDate에서 7일 더한 일자(일)에서 현재 일자(일)을 뺀 숫자
					.memNo(reviewAuth.getMember().getMemNo())
	                .cafeNo(reviewAuth.getCafe().getCafeNo())
	                .cafeName(reviewAuth.getCafe().getCafeName())
	                .build();
	    }
}
