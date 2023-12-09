package com.yummsters.cafehub.domain.payment.service;

import java.util.Map;

public interface PaymentService {
    void paymentConfirm(Map<String, Object> paymentData) throws Exception;
}
