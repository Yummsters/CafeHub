package com.yummsters.cafehub.domain.payment.dto;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.payment.entity.Method;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentDTO {
    private Integer paymentKey; // toss paymentKey, 결제 키값
    private String type; // 결제 타입 정보
    private String orderId; // 주문 ID, 주문 결제 식별
    private Method method;
    private Integer totalAmount;
    private String status; // 결제 처리 상태
    private String approvedAt; // 결제 승인 날짜
    private String lastTransactionKey;
    private String cancles;
    private Integer memNo;
}
