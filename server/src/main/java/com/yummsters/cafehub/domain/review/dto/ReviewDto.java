package com.yummsters.cafehub.domain.review.dto;

import java.time.LocalDateTime;

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
	private Integer writer;
	private Integer cafeNo;
	private Integer likeCount;
	private LocalDateTime regDate;
	

}
