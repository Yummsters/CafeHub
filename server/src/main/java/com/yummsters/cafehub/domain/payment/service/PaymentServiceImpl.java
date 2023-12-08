package com.yummsters.cafehub.domain.payment.service;

import com.yummsters.cafehub.domain.payment.entity.Method;
import com.yummsters.cafehub.domain.payment.repository.PaymentRepository;
import com.yummsters.cafehub.domain.payment.repository.PaymentRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
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
    private final PaymentRepositoryImpl repository;
    @Override
    public void paymentConfirm(Map<String, Object> paymentData) throws Exception {
        try {
            String secretKey = "";
            String encodedSecretKey = Base64.getEncoder().encodeToString((secretKey + ":").getBytes());
            String authorizations = "Basic " + encodedSecretKey;

            URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");

            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("Authorization", authorizations);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);

            // 데이터 준비
            JSONObject tossRequestData = new JSONObject();
            tossRequestData.put("orderId", paymentData.get("orderId"));
            tossRequestData.put("amount", paymentData.get("amount"));
            tossRequestData.put("paymentKey", paymentData.get("paymentKey"));

            // 데이터 전송
            OutputStream os = connection.getOutputStream();
            OutputStreamWriter osw = new OutputStreamWriter(os, StandardCharsets.UTF_8);
            osw.write(tossRequestData.toJSONString());
            osw.flush();

            int code = connection.getResponseCode();
            boolean isSuccess = code == 200;

            InputStream responseStream = isSuccess ? connection.getInputStream() : connection.getErrorStream();

            Reader reader = new InputStreamReader(responseStream, StandardCharsets.UTF_8);
            JSONParser parser = new JSONParser();
            JSONObject jsonObject = (JSONObject) parser.parse(reader);
            responseStream.close();


            System.out.println(jsonObject.toJSONString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
