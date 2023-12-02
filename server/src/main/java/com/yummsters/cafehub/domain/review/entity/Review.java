package com.yummsters.cafehub.domain.review.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.yummsters.cafehub.domain.map.entity.Cafe;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.tag.entity.ReviewToTag;
import com.yummsters.cafehub.domain.map.entity.Cafe;
import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import com.yummsters.cafehub.domain.review.dto.ReviewDto;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@DynamicInsert
@DynamicUpdate
@ToString(exclude = {"member", "cafe", "reviewToTags"})
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
   @Column(name = "thumb_img", nullable = false)
   private String thumbImg;

//   @Column
//   @ManyToOne
//   private Member writer;
//   @Column
//   private Integer cafeNo;

   @ManyToOne (fetch = FetchType.LAZY)
   @JoinColumn(name = "writer") // 외래키
   private Member member;


	@ManyToOne
	@JoinColumn(name = "writer") // 외래키
	private Member member;

	@ManyToOne
	@JoinColumn(name = "cafeNo") // 외래키
	private Cafe cafe;
	@Column
	private Integer likeCount;
	@Column
	private LocalDateTime regDate;
	@OneToMany(mappedBy = "review")
	private List<ReviewToTag> reviewToTags = new ArrayList<>();


   @Override
   public String toString() {
       return String.format("[%d,%s,%s,%s,%s,%d,%d,%d,%s]",
               reviewNo, title, content, tagName, thumbImg, member.getMemNo(), cafe.getCafeNo(), likeCount, regDate);
   }
   

}