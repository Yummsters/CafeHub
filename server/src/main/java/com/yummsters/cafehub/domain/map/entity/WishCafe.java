package com.yummsters.cafehub.domain.map.entity;

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
public class WishCafe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer wishReviewNo;
    @ManyToOne
    @JoinColumn(name = "memNo")
    private Member member;
    @ManyToOne
    @JoinColumn(name = "cafeNo")
    private Cafe cafe;
}
