package com.yummsters.cafehub.domain.map.controller;

import com.yummsters.cafehub.domain.map.dto.CafeDTO;
import com.yummsters.cafehub.domain.map.service.CafeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CafeController {
    @Autowired
    private CafeServiceImpl service;

    @GetMapping("/mapData")
    public ResponseEntity<String> saveCafe() {
        try {
            service.saveCafe();
            return new ResponseEntity<>("저장", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("저장실패", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/mapMarker")
    public ResponseEntity<List<CafeDTO>> getAllCafes() {
        try {
            List<CafeDTO> cafes = service.getCafes(); // 서비스에서 DTO 목록을 가져옴
            return new ResponseEntity<>(cafes, HttpStatus.OK); // 클라이언트에 반환
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/cafeIsWish/{memNo}/{cafeNo}")
    public ResponseEntity<Boolean> isWish(@PathVariable Integer memNo, @PathVariable Integer cafeNo) {
        try {
            Boolean isWish = service.isWishCafe(memNo, cafeNo);
            return new ResponseEntity<>(isWish, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/cafeWish/{memNo}/{cafeNo}")
    public ResponseEntity<Boolean> isWishCafe(@PathVariable Integer memNo, @PathVariable Integer cafeNo) {
        try {
            Boolean toggleWish = service.toggleWishCafe(memNo, cafeNo);
            return new ResponseEntity<>(toggleWish, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
