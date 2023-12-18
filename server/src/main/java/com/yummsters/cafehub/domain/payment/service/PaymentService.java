package com.yummsters.cafehub.domain.payment.service;

import com.yummsters.cafehub.domain.payment.entity.Payment;

import java.util.Map;

public interface PaymentService {
    void paymentConfirm(Map<String, Object> paymentData) throws Exception;
    void paymentCancel(Map<String, Object> paymentData) throws Exception;
    Payment searchPaymentKey(String paymentKey) throws Exception;
}
