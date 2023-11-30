package com.yummsters.cafehub.domain.review.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
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
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer reviewNo;
	@Column(length = 255)
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

//	public enum TagName {
//		    카공,
//		    인스타감성,
//		    고양이,
//		    드로잉,
//		    이색,
//		    주류판매,
//		    뷰맛집,
//		    브런치,
//		    인테리어맛집,
//		    대형,
//		    디저트,
//		    자연친화적
//	}
	@Override
	public String toString() {	
		return String.format("[%d,%s,%s,%s,%s,%d,%d,%d,%s]", reviewNo, title,content,tagName, thumbImg,writer,cafeNo,likeCount,regDate);
	}
	
}
