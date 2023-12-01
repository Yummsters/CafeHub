package com.yummsters.cafehub.domain.map.service;

import com.yummsters.cafehub.domain.map.dto.CafeDTO;
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

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yummsters.cafehub.domain.map.dto.CafeDTO;
import com.yummsters.cafehub.domain.map.entity.Cafe;
import com.yummsters.cafehub.domain.map.repository.CafeRepository;

import lombok.extern.log4j.Log4j2;


@Service
@Log4j2
public class MapServiceImpl implements MapService {
    @Autowired
    private CafeRepository repository;

    @Override
    public void saveCafe() throws Exception {
        List<Cafe> cafes = new ArrayList<>();

        int totalCount = 45; // 총 데이터 수
        int countPerPage = 15; // 페이지 당 데이터 수
        int totalPages = (totalCount + countPerPage - 1) / countPerPage; // 전체 페이지 수

        for (int page = 1; page <= totalPages; page++) { // API 에서 최대로 제공하는 데이터 수
            StringBuilder urlBuilder = new StringBuilder("https://dapi.kakao.com/v2/local/search/keyword.json");
            urlBuilder.append("?query=" + URLEncoder.encode("테마카페", "UTF-8"));
            urlBuilder.append("&page=" + page);

            URL url = new URL(urlBuilder.toString());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("content-type", "application/json;charset=UTF-8");
            conn.setRequestProperty("Authorization", "key");

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

    @Override
    public List<CafeDTO> getCafes() throws Exception {
        List<Cafe> cafeList = repository.findAll(); // Entity, DB의 모든 정보

        List<CafeDTO> cafeDTOList = new ArrayList<>(); // DTO
        for (Cafe cafe : cafeList) {
            CafeDTO cafeDTO = cafe.toDto(); // Entity -> DTO로 변환
            cafeDTOList.add(cafeDTO); // 내용 복사
        }
        return cafeDTOList;
    }
}
