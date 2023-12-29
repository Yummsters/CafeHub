package com.yummsters.cafehub.domain.review.dto;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

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
public class MyReviewAuthResDto {
	  
	    private Integer reviewAuthNo;
	    private LocalDateTime regDate;


	    private Integer memNo; 
	    private String nickname;  

	    private Integer cafeNo; 
	    private String cafeName; 
	    private String address;
		private Integer remainTime;
		
		
	 
	    	public static MyReviewAuthResDto reviewToMyReviewAuthRes(ReviewAuth reviewAuth) {
	    	    if (reviewAuth == null) {
	    	        return null;
	    	    } else {
	    	        MyReviewAuthResDto.MyReviewAuthResDtoBuilder reviewAuthRes = MyReviewAuthResDto.builder();

	    	        reviewAuthRes.reviewAuthNo(reviewAuth.getReviewAuthNo());
	    	        reviewAuthRes.regDate(reviewAuth.getRegDate());
	    	        int remainTime = (int) ChronoUnit.DAYS.between(LocalDateTime.now().toLocalDate(), reviewAuth.getRegDate().plusDays(7).toLocalDate());
                    reviewAuthRes.remainTime(remainTime);
 
	    	        if (reviewAuth.getMember() != null) {
	    	            reviewAuthRes.memNo(reviewAuth.getMember().getMemNo());
	    	            reviewAuthRes.nickname(reviewAuth.getMember().getNickname());
	    	        }

	    	        // 카페 정보
	    	        if (reviewAuth.getCafe() != null) {
	    	            reviewAuthRes.cafeNo(reviewAuth.getCafe().getCafeNo());
	    	            reviewAuthRes.cafeName(reviewAuth.getCafe().getCafeName());
	    	            reviewAuthRes.address(reviewAuth.getCafe().getAddress());
	    	           
	    	        }
	    	        return reviewAuthRes.build();
	    	    }
	    	}

	   
	   
	  

}
