package com.yummsters.cafehub.domain.review.dto;

import java.time.LocalDateTime;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import com.querydsl.core.annotations.QueryProjection;
import com.yummsters.cafehub.domain.map.entity.Cafe;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.review.entity.Review;


import com.yummsters.cafehub.domain.review.entity.FileVo;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.repository.FileVoRepository;
import java.io.IOException;
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

	// Member 정보
	private Integer memNo;  // Member의 PK 혹은 외래키
	private String nickname;  // Member의 이름 등

	// Cafe 정보
	private Cafe cafeNo;  // Cafe의 PK 혹은 외래키
	private String cafeName;  // Cafe의 이름
	private String lat;
	private String lng;
  
	private String fileurl;
	
	
	public void setFileurl(String fileurl) {
		this.fileurl = fileurl;
	}
	 public void setTagName(String tagName) {
	        this.tagName = tagName;
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
		            .likeCount(likeCount)
		            .regDate(LocalDateTime.now())
		            .build();
	}

}
