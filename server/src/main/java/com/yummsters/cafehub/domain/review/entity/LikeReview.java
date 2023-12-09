package com.yummsters.cafehub.domain.review.entity;

import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.*;

import javax.persistence.*;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LikeReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer likeReviewNo;
    @ManyToOne
    @JoinColumn(name = "memNo")
    private Member member;
    @ManyToOne
    @JoinColumn(name = "reviewNo")
    private Review review;
}
