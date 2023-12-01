package com.yummsters.cafehub.domain.review.entity;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.*;

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
@ToString(exclude = {"member", "cafe"})
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
   @Column(name = "thumb_img")
   private String thumbImg;

//   @Column
//   @ManyToOne
//   private Member writer;
//   @Column
//   private Integer cafeNo;

   @ManyToOne (fetch = FetchType.LAZY)
   @JoinColumn(name = "writer") // 외래키
   private Member member;

   @ManyToOne (fetch = FetchType.LAZY)
   @JoinColumn(name = "cafeNo") // 외래키
   private Cafe cafe;
   
   @OneToMany(mappedBy = "review")
   private List<FileVo> files;

   @Column
   private Integer likeCount;
   @Column
   private LocalDateTime regDate;

//   public enum TagName {
//          카공,
//          인스타감성,
//          고양이,
//          드로잉,
//          이색,
//          주류판매,
//          뷰맛집,
//          브런치,
//          인테리어맛집,
//          대형,
//          디저트,
//          자연친화적
//   }

//   @Override
//   public String toString() {
//      return String.format("[%d,%s,%s,%s,%s,%d,%d,%d,%s]",
//            reviewNo, title,content,tagName, thumbImg,member.getMemNo(),cafe.getCafeNo(),likeCount,regDate);
//   }
   @Override
   public String toString() {
       return String.format("[%d,%s,%s,%s,%s,%d,%d,%d,%s]",
               reviewNo, title, content, tagName, thumbImg, member.getMemNo(), cafe.getCafeNo(), likeCount, regDate);
   }
   
}