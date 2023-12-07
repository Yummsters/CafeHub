package com.yummsters.cafehub.domain.point.entity;

import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.naming.InsufficientResourcesException;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Point {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pointNo;

    @Column(nullable = false)
    private Integer pointCount;

    @CreatedDate
    private LocalDateTime regDate;

    @OneToOne
    @JoinColumn(name="memNo")
    private Member member;

    @Builder
    public Point(Integer pointCount, Member member) {
        this.pointCount = pointCount;
        this.member = member;
    }

    // 포인트 적립
    public void plusPoint(Integer pointCount) throws InsufficientResourcesException {
        this.pointCount = calculatePoint(getPointCount()+pointCount);
    }

    // 포인트 사용
    public void usePoint(Integer pointCount) throws InsufficientResourcesException {
         this.pointCount = calculatePoint(getPointCount()-pointCount);
    }

    private Integer calculatePoint(Integer pointCount) throws InsufficientResourcesException {
        if (pointCount < 0) {
            throw new InsufficientResourcesException("포인트는 음수가 될 수 없습니다.");
        }
        return pointCount;
    }
}
