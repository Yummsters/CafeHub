package com.yummsters.cafehub.domain.member.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
@RequiredArgsConstructor
public class BusinessServiceImpl implements BusinessService {
    @Value("${businessKey}")
    private String secretKey;
    @Override
    public String buisnessExist (String businessNo) throws Exception {
        StringBuilder urlBuilder = new StringBuilder("https://api.odcloud.kr/api/nts-businessman/v1/status");
        urlBuilder.append("?serviceKey=" + secretKey);

        String str = "{\"b_no\": [\"" + businessNo + "\"]}";
//        System.out.println(str);

        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");  // GET 메서드를 사용
        conn.setRequestProperty("Content-type", "application/json; utf-8");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = str.getBytes("utf-8");
            os.write(input, 0, input.length);
        }
        BufferedReader br;
        int resultCode = conn.getResponseCode();
        if (resultCode >= 200 && resultCode < 300) {  // 정상인 경우
            br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {  // 에러
            br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }
        StringBuilder responseBuilder = new StringBuilder();
        String line;
        while((line=br.readLine()) != null){
            responseBuilder.append(line);
        }
        br.close();
        conn.disconnect();

        return responseBuilder.toString();
    }

}
