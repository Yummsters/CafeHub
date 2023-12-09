package com.yummsters.cafehub.domain.userMyPage.entity;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.review.entity.Review;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WishReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer wishReviewNo;
    @ManyToOne
    @JoinColumn(name = "memNo")
    private Member member;
    @ManyToOne
    @JoinColumn(name = "reviewNo")
    private Review review;
}
