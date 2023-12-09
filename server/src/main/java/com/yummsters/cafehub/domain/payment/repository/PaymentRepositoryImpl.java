package com.yummsters.cafehub.domain.payment.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.yummsters.cafehub.domain.member.entity.QMember;
import com.yummsters.cafehub.domain.payment.dto.PaymentDTO;
import com.yummsters.cafehub.domain.payment.entity.Payment;
import com.yummsters.cafehub.domain.payment.entity.QPayment;
import com.yummsters.cafehub.domain.review.dto.ReviewDetailDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PaymentRepositoryImpl {
    private final JPAQueryFactory jpaQueryFactory;
    private final QPayment payment = QPayment.payment;
    private final QMember member = QMember.member;

    public PaymentDTO payConfirmResult(Integer memNo) {
        PaymentDTO paymentDTO = jpaQueryFactory
                .select(Projections.bean(PaymentDTO.class,
                        payment.paymentKey, payment.orderId, payment.lastTransactionKey,
                        payment.orderName, payment.paymentMethod, payment.amount, payment.status,
                        payment.requestedAt, payment.approvedAt, member.memNo))
                .from(payment)
                .leftJoin(payment.member, member)
                .where(payment.member.memNo.eq(memNo))
                .fetchOne();
        return paymentDTO;
    }
}