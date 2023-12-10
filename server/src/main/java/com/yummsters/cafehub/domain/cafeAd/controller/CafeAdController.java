package com.yummsters.cafehub.domain.cafeAd.controller;

import com.yummsters.cafehub.domain.cafeAd.dto.CafeAdReqDto;
import com.yummsters.cafehub.domain.cafeAd.dto.SearchResDto;
import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.cafeAd.service.CafeAdService;
import com.yummsters.cafehub.domain.map.entity.Cafe;
import com.yummsters.cafehub.domain.map.service.CafeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cafeAd")
public class CafeAdController {
    private final CafeAdService cafeAdService;
    private final CafeService cafeService;

    // 광고 신청 조회
    @GetMapping("/{cafeNo}")
    public ResponseEntity<Object> searchAd(@PathVariable("cafeNo") Integer cafeNo){
        try{
            CafeAd responseSearchCafe = cafeAdService.searchCafeAd(cafeNo);
            SearchResDto responseDto = SearchResDto.CafeAdToSearchResDto(responseSearchCafe);
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
