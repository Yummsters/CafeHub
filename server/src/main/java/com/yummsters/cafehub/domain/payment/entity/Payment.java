package com.yummsters.cafehub.domain.payment.entity;

import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentNo;
//    @Column(nullable = false)
    private String paymentKey; // toss paymentKey, 결제 키값
//    @Column(nullable = false)
    private String orderId; // toss orderId, 주문 ID (주문 결제 식별)
//    @Column(nullable = false)
    private String lastTransactionKey; // toss lastTransactionKey, 마지막 거래 키 값 (승인/취소 식별)
//    @Column(nullable = false)
    private String orderName; // toss orderName, 주문명(포인트/광고)
//    @Column(nullable = false)
    private String paymentMethod; // toss method, 결제 타입 정보
//    @Column(nullable = false)
    private Integer amount; // toss totalAmount, 결제 금액
//    @Column(nullable = false)
    private String status; // toss paymentStatus, 결제 처리 상태
//    @Column(nullable = false)
    private String requestedAt; // 결제 일시
//    @Column(nullable = false)
    private String approvedAt; // 결제 승인 일시
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "memNo") // 외래키
    private Member member;
}
