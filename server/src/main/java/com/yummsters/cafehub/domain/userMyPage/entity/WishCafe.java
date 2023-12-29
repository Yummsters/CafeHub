package com.yummsters.cafehub.domain.userMyPage.entity;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.member.entity.Member;
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
