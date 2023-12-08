package com.yummsters.cafehub.domain.payment.entity;

import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@ToString
public class Payment {
    @Id
    private Integer paymentKey; // toss paymentKey, 결제 키값
    @Column(nullable = false)
    private String type; // 결제 타입 정보
    @Column(nullable = false)
    private String orderId; // 주문 ID, 주문 결제 식별
    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    private Method method;
    @Column(nullable = false)
    private Integer totalAmount;
    @Column(nullable = false)
    private String status; // 결제 처리 상태
    @Column(nullable = false)
    private String approvedAt; // 결제 승인 날짜
    @Column(nullable = true)
    private String lastTransactionKey;
    @Column(nullable = true)
    private String cancles;
    @ManyToOne
    @JoinColumn(name = "memNo") // 외래키
    private Member member;

}
