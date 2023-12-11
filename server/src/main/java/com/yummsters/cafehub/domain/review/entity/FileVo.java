package com.yummsters.cafehub.domain.review.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity(name="FILE")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileVo {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "fileNum" , insertable = false, updatable = false)
	private Integer fileNum;
	@ManyToOne
	@JoinColumn(name = "review_no")
	private Review review;
	@Column
	private String directory;
	@Column
	private String name;
	@Column
	private Long size;
	@Column(name = "contenttype")
	private String contenttype;
	@Column
	private Date uploaddate;
	 @Lob
	 @Column(name = "data", columnDefinition = "LONGBLOB")
	private byte[] data;
	 // 추가: reviewNo의 Getter 메서드
    public Integer getReviewNo() {
        return review != null ? review.getReviewNo() : null;
    }

}