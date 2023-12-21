package com.yummsters.cafehub.domain.review.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.point.entity.Point;
import com.yummsters.cafehub.domain.tag.entity.ReviewToTag;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@DynamicInsert
@DynamicUpdate
//@ToString(exclude = {"member", "cafe", "reviewToTags"})
public class Review {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Integer reviewNo;
   @Column(length = 255)
   private String title;
   @Column
   private String content;
   @Column(name = "thumb_img", nullable = false,columnDefinition = "TEXT")
   private String thumbImg;
   @ManyToOne (fetch = FetchType.LAZY)
   @JoinColumn(name = "writer") // 외래키
   private Member member;
	@ManyToOne
	@JoinColumn(name = "cafeNo") // 외래키
	private Cafe cafe;
    @Column
    private String subTitle;
	@Column
	private Integer likeCount;
	@Column
	private LocalDateTime regDate;
    @Column
    private boolean modPossible;
	@OneToMany(mappedBy = "review")
	private List<ReviewToTag> reviewToTags = new ArrayList<>();
	@ManyToOne
	@JoinColumn(name="pointNo")
	private Point point;

	private String tagName;
	 public void setTagName(String tagName) {
	        this.tagName = tagName;
	    }
   @Override
   public String toString() {
       return String.format("[%d,%s,%s,%s,%d,%d,%d,%s]",
               reviewNo, title, content, thumbImg, member.getMemNo(), cafe.getCafeNo(), likeCount, regDate);
   }
}