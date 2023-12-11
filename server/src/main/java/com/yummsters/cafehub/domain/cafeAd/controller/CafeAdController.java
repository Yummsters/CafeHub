package com.yummsters.cafehub.domain.cafeAd.controller;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.cafe.service.CafeService;
import com.yummsters.cafehub.domain.cafeAd.dto.CafeAdReqDto;
import com.yummsters.cafehub.domain.cafeAd.dto.SearchResDto;
import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.cafeAd.service.CafeAdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    // 광고 신청
    @PostMapping("/{cafeNo}")
    public ResponseEntity<Object> cafeAdSub(@PathVariable("cafeNo") Integer cafeNo,
                                            @ModelAttribute CafeAdReqDto cafeAdReqDto,
                                            @RequestParam("thumbImg") MultipartFile thumbImg) throws Exception {
        Cafe cafe = null;
        try{
            cafe = cafeService.searchCafe(cafeNo);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

        CafeAd cafeAd = CafeAdReqDto.cafeAdReqDto(cafeAdReqDto, cafe);

        try{
            CafeAd responseCafeAd = cafeAdService.cafeAdSub(cafeAd, thumbImg);
            SearchResDto responseDto = SearchResDto.CafeAdToSearchResDto(responseCafeAd);
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
