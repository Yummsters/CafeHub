package com.yummsters.cafehub.domain.review.entity;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class ReviewAuth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewAuthNo;

    @CreatedDate
    private LocalDateTime regDate;

    @ManyToOne
    @JoinColumn(name = "memNo")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "cafeNo")
    private Cafe cafe;

    @Builder
    public ReviewAuth(Integer reviewAuthNo, LocalDateTime regDate, Member member, Cafe cafe) {
        this.reviewAuthNo = reviewAuthNo;
        this.regDate = regDate;
        this.member = member;
        this.cafe = cafe;
    }
}
