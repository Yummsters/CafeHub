package com.yummsters.cafehub.domain.review.entity;

import com.yummsters.cafehub.domain.map.entity.Cafe;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.tag.entity.ReviewToTag;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


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
