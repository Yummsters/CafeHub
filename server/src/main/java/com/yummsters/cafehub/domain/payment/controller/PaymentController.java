package com.yummsters.cafehub.domain.payment.controller;

import com.yummsters.cafehub.domain.payment.entity.Payment;
import com.yummsters.cafehub.domain.payment.service.PaymentService;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("payment")
public class PaymentController {
    @Autowired
    private PaymentService service;

    @PostMapping("result") // 결과를 통해 toss에 결제 승인 요청
    public ResponseEntity<Boolean> paymentResult(@RequestBody Map<String, Object> paymentData) {
        try {
            service.paymentConfirm(paymentData);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("refund") // 환불 요청
    public ResponseEntity<Boolean> paymentRefund(@RequestBody Map<String, Object> paymentData) {
        try {
            service.paymentCancel(paymentData);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
}
