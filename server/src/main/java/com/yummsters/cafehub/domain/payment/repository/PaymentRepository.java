package com.yummsters.cafehub.domain.payment.repository;

import com.yummsters.cafehub.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Payment findByPaymentKey(String paymentKey);
}
