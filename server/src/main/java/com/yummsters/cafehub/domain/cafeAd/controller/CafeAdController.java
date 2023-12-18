package com.yummsters.cafehub.domain.cafeAd.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.cafe.service.CafeService;
import com.yummsters.cafehub.domain.cafeAd.dto.CafeAdReqDto;
import com.yummsters.cafehub.domain.cafeAd.dto.SearchResDto;
import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.cafeAd.service.CafeAdService;
import com.yummsters.cafehub.domain.payment.entity.Payment;
import com.yummsters.cafehub.domain.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cafeAd")
public class CafeAdController {
    private final CafeAdService cafeAdService;
    private final CafeService cafeService;
    private final PaymentService paymentService;

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
                                            @RequestParam("thumbImg") MultipartFile thumbImg,
                                            @RequestParam("paymentKey") String paymentKey) throws Exception {
        Cafe cafe = null;
        try{
            cafe = cafeService.searchCafe(cafeNo);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

        Payment payment = null;
        try{
            payment = paymentService.searchPaymentKey(paymentKey);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

        CafeAd cafeAd = CafeAdReqDto.cafeAdReqDto(cafeAdReqDto, cafe, payment);

        try{
            CafeAd responseCafeAd = cafeAdService.cafeAdSub(cafeAd, thumbImg);
            SearchResDto responseDto = SearchResDto.CafeAdToSearchResDto(responseCafeAd);
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    //혜리 part-------------------------------------------------------
    @GetMapping("/approvedAds")
    public ResponseEntity<List<CafeAdReqDto>> getApprovedAds() {
        try {
            List<CafeAd> approvedAds = cafeAdService.getApprovedAds();
            List<CafeAdReqDto> responseDtoList = new ArrayList<>();

            for (CafeAd cafeAd : approvedAds) {
                CafeAdReqDto cafeAdReqDto = CafeAdReqDto.builder()
                        .description(cafeAd.getDescription())
                        .menu(cafeAd.getMenu())
                        .build();
                responseDtoList.add(cafeAdReqDto);
            }

            return new ResponseEntity<>(responseDtoList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/unapprovedAds")
    public ResponseEntity<List<Map<String, Object>>> getUnapprovedAds() {
    	try {
    		List<Map<String, Object>> unapprovedAds = cafeAdService.getUnapprovedAds();
    		return new ResponseEntity<>(unapprovedAds, HttpStatus.OK);
    	} catch (Exception e) {
    		e.printStackTrace();
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	}
    }
}
