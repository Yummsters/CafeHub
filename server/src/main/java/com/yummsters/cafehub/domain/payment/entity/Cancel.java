package com.yummsters.cafehub.domain.payment.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@ToString
public class Cancel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionKey;
    private String cancleReason; // 취소 이유
    private String canceledAt; // 취소 일시
    private Integer cancelAmount; // 취소 금액
}
