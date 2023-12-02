package com.yummsters.cafehub.domain.review.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

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
	private Integer writer;
	private Integer cafeNo;
	private Integer likeCount;
	private LocalDateTime regDate;
	private String fileurl;
	
	
	public void setFileurl(String fileurl) {
		this.fileurl = fileurl;
	}
	
	

	
	public Review toEntity() {
		 return Review.builder()
				 .reviewNo(reviewNo)
		            .title(title)
		            .content(content)
		            .tagName(tagName)
		            .thumbImg(thumbImg)    
		            .likeCount(likeCount)
		            .regDate(regDate)
		            .build();
	}

}
