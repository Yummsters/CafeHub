package com.yummsters.cafehub.domain.payment.service;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.cafeAd.repository.CafeAdRepository;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.payment.entity.Payment;
import com.yummsters.cafehub.domain.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService{
    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final CafeAdRepository cafeAdRepository;
    @Value("${toss-secret-key}")
    private String secretKey;
    @Override
    public void paymentConfirm(Map<String, Object> paymentData) throws Exception {
        Integer memNo = (Integer) paymentData.get("memNo");
        Member member = memberRepository.findByMemNo(memNo);

        // secretKey Encoding
        String encodedSecretKey = Base64.getEncoder().encodeToString((secretKey + ":").getBytes());
        String authorizations = "Basic " + encodedSecretKey;

        String apiUrl = "https://api.tosspayments.com/v1/payments/confirm";

        JSONObject requestData = new JSONObject();
        requestData.put("orderId", paymentData.get("orderId"));
        requestData.put("amount", paymentData.get("amount"));
        requestData.put("paymentKey", paymentData.get("paymentKey"));

        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", authorizations);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = requestData.toJSONString().getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int resCode = conn.getResponseCode();

        StringBuilder response = new StringBuilder();
        if (resCode == HttpURLConnection.HTTP_OK) {
            try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
            }
        } else {
            try (BufferedReader errorIn = new BufferedReader(new InputStreamReader(conn.getErrorStream()))) {
                String errorInputLine;
                while ((errorInputLine = errorIn.readLine()) != null) {
                    response.append(errorInputLine);
                }
            }
        }

        JSONParser parser = new JSONParser();
        JSONObject paymentObj = (JSONObject) parser.parse(response.toString()); // jsonData 결과값

        Payment payment = new Payment();
        payment.setPaymentKey((String) paymentObj.get("paymentKey"));
        payment.setOrderId((String) paymentObj.get("orderId"));
        payment.setOrderName((String) paymentObj.get("orderName"));
        payment.setAmount((Integer)((Long) paymentObj.get("totalAmount")).intValue());
        payment.setStatus((String) paymentObj.get("paymentStatus"));
        payment.setApprovedAt((String) paymentObj.get("approvedAt"));
        payment.setPaymentMethod((String) paymentObj.get("method"));
        payment.setStatus((String) paymentObj.get("status"));
        payment.setMember(member);

        paymentRepository.save(payment);
    }

    @Override
    public void paymentCancel(Map<String, Object> paymentData) throws Exception { // 환불은 광고 등록만 가능
        Integer cafeNo = (Integer) paymentData.get("cafeNo");
        CafeAd cafeAd = cafeAdRepository.findByCafe_CafeNo(cafeNo);

        String paymentKey;

        if (cafeAd == null) {
            paymentKey = (String) paymentData.get("paymentKey");
        } else {
            paymentKey = cafeAd.getPayment().getPaymentKey();
        }

        Payment payment = paymentRepository.findByPaymentKey(paymentKey);

        // secretKey Encoding
        String encodedSecretKey = Base64.getEncoder().encodeToString((secretKey + ":").getBytes());
        String authorizations = "Basic " + encodedSecretKey;

        String apiUrl = "https://api.tosspayments.com/v1/payments/" + paymentKey + "/cancel";

        JSONObject requestData = new JSONObject();
        requestData.put("cancelReason", paymentData.get("cancelReason"));

        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", authorizations);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = requestData.toJSONString().getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int resCode = conn.getResponseCode();

        StringBuilder response = new StringBuilder();
        if (resCode == HttpURLConnection.HTTP_OK) {
            try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
            }
        } else {
            try (BufferedReader errorIn = new BufferedReader(new InputStreamReader(conn.getErrorStream()))) {
                String errorInputLine;
                while ((errorInputLine = errorIn.readLine()) != null) {
                    response.append(errorInputLine);
                }
            }
        }

        JSONParser parser = new JSONParser();
        JSONObject paymentObj = (JSONObject) parser.parse(response.toString());
        payment.setStatus((String) paymentObj.get("status"));

        JSONArray cancelsArray = (JSONArray) paymentObj.get("cancels");
        for (Object cancelObj : cancelsArray) {
            JSONObject cancels = (JSONObject) cancelObj;
            payment.setCanceledAt((String) cancels.get("canceledAt"));
            payment.setCancleReason((String) cancels.get("cancelReason"));
        }
        paymentRepository.save(payment);
    }

    @Override
    public Payment searchPaymentKey(String paymentKey) throws Exception {
        return paymentRepository.findByPaymentKey(paymentKey);
    }
}
