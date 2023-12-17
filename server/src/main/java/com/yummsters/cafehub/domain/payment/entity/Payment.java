package com.yummsters.cafehub.domain.payment.entity;

import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Payment implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentNo;
    private String paymentKey; // toss paymentKey, 결제 키값
    private String orderId; // toss orderId, 주문 ID (주문 결제 식별)
    private String orderName; // toss orderName, 주문명(포인트/광고)
    private String paymentMethod; // toss method, 결제 타입 정보
    private Integer amount; // toss totalAmount, 결제 금액
    private String status; // toss paymentStatus, 결제 처리 상태
    private String approvedAt; // 결제 승인 일시
    private String cancleReason; // 취소 이유
    private String canceledAt; // 취소 일시
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "memNo") // 외래키
    private Member member;
}
