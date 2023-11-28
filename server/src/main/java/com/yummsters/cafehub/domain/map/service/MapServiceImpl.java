package com.yummsters.cafehub.domain.map.service;

import com.yummsters.cafehub.domain.map.entity.Cafe;
import com.yummsters.cafehub.domain.map.repository.CafeRepository;
import lombok.extern.log4j.Log4j2;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;


@Service
@Log4j2
public class MapServiceImpl implements MapService {
    @Autowired
    private CafeRepository repository;

    @Override
    public void saveCafe() throws Exception {
        List<Cafe> cafes = new ArrayList<>();

        for (int page = 1; page <= 45; page++) { // API 에서 최대로 제공하는 데이터 수
            StringBuilder urlBuilder = new StringBuilder("https://dapi.kakao.com/v2/local/search/keyword.json");
            urlBuilder.append("?query=" + URLEncoder.encode("테마카페", "UTF-8"));

            URL url = new URL(urlBuilder.toString());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("content-type", "application/json;charset=UTF-8");
            conn.setRequestProperty("Authorization", " KakaoAK c95c7f73f119e07ce4e82a038f1d7883");

            StringBuilder resBuilder = new StringBuilder();
            try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                String line;
                while ((line = br.readLine()) != null) {
                    resBuilder.append(line);
                }
            } finally {
                conn.disconnect();
            }

            JSONParser parser = new JSONParser();
            JSONObject mobj = (JSONObject) parser.parse(resBuilder.toString());
            JSONArray data = (JSONArray) mobj.get("documents");

            for (int i = 0; i < data.size(); i++) {
                JSONObject cafeJson = (JSONObject) data.get(i);

                Cafe cafe = new Cafe();
                cafe.setCafeName((String) cafeJson.get("place_name"));
                cafe.setTel((String) cafeJson.get("phone"));
                cafe.setAddress((String) cafeJson.get("address_name"));
                cafe.setLat((String) cafeJson.get("y"));
                cafe.setLng((String) cafeJson.get("x"));

                cafes.add(cafe);
            }
        }
        repository.saveAll(cafes);
    }
}
