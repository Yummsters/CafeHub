package com.yummsters.cafehub.domain.review.entity;

import java.time.LocalDateTime;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


@Entity(name="FILE")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
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
	@CreatedDate
	private LocalDateTime uploaddate;
	 @Lob
	 @Column(name = "data", columnDefinition = "LONGBLOB")
	private byte[] data;
    public Integer getReviewNo() {
        return review != null ? review.getReviewNo() : null;
    }
}