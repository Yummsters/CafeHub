package com.yummsters.cafehub.domain.cafe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yummsters.cafehub.domain.cafe.dto.CafeDto;
import com.yummsters.cafehub.domain.cafe.service.CafeServiceImpl;

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
    public ResponseEntity<List<CafeDto>> getAllCafes() {
        try {
            List<CafeDto> cafes = service.getCafes(); // 서비스에서 DTO 목록을 가져옴
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

    @GetMapping("map/{cafeNo}")
    public ResponseEntity<CafeDto> getCafeByCafeNo(@PathVariable Integer cafeNo) {
        try {
            CafeDto cafe = service.getCafeByCafeNo(cafeNo);
            return new ResponseEntity<>(cafe, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // 혜리 part---------------------------------------------------------------------------
    @GetMapping("/managerConfirm")
    public ResponseEntity<Page<CafeDto>> getUnpaidCafes(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CafeDto> unpaidCafes = service.getUnpaidCafes(pageable);
            return new ResponseEntity<>(unpaidCafes, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
