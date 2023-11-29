package com.yummsters.cafehub.domain.review.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import com.yummsters.cafehub.domain.review.dto.ReviewDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@DynamicInsert
@DynamicUpdate
public class Review {
	@Id
	private Integer reviewNo;
	@Column
	private String title;
	@Column
	private String content;
	@Column
	private String tagName;
	@Column
	private String thumbImg;
	@Column
	private Integer writer;
	@Column
	private Integer cafeNo;
	@Column
	private Integer likeCount;
	@Column
	private LocalDateTime regDate;
	
	@Override
	public String toString() {	
		return String.format("[%d,%s,%s,%s,%s,%d,%d,%d,%s]", reviewNo, title,content,tagName, thumbImg,writer,cafeNo,likeCount,regDate);
	}
	
}
