package com.yummsters.cafehub.domain.payment.dto;

import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentDto {
    private Integer paymentNo;
    private String paymentKey; // toss paymentKey, 결제 키값
    private String orderId; // toss orderId, 주문 ID (주문 결제 식별)
    private String lastTransactionKey; // toss lastTransactionKey, 마지막 거래 키 값 (승인/취소 식별)
    private String orderName; // toss orderName, 주문명(포인트/광고)
    private String paymentMethod; // toss method, 결제 타입 정보
    private Integer amount; // toss totalAmount, 결제 금액
    private String status; // toss paymentStatus, 결제 처리 상태
    private String requestedAt; // 결제 일시
    private String approvedAt; // 결제 승인 일시
    private Integer memNo;
}
