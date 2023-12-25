package com.yummsters.cafehub.domain.cafeAd.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.cafe.service.CafeService;
import com.yummsters.cafehub.domain.cafeAd.dto.CafeAdInterface;
import com.yummsters.cafehub.domain.cafeAd.dto.CafeAdReqDto;
import com.yummsters.cafehub.domain.cafeAd.dto.SearchResDto;
import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.cafeAd.service.CafeAdService;
import com.yummsters.cafehub.domain.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CafeAdController {
    private final CafeAdService cafeAdService;
    private final CafeService cafeService;
    private final PaymentService paymentService;

    // 광고 신청 조회
    @GetMapping("/store/cafeAd/{cafeNo}")
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
    @PostMapping("/store/cafeAd/{cafeNo}")
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

    // 선진 part ----------------------------------------------------
    // 광고신청 취소 (미결제)
    @DeleteMapping("/cafeAd/{cafeNo}")
    public ResponseEntity<Object> deleteAd(@PathVariable("cafeNo") Integer cafeNo){
        try{
            boolean isDelete = cafeAdService.deleteCafeAd(cafeNo);
            return new ResponseEntity<>(isDelete, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    // 결제 후 paymentKey 추가 및 isPaid true로 변경
    @PutMapping("/cafeAd/{cafeNo}/{paymentKey}")
    public ResponseEntity<Object> updateAd(@PathVariable("cafeNo") Integer cafeNo,
                                           @PathVariable("paymentKey") String paymentKey){
        try{
            CafeAd updateCafeAd = cafeAdService.paymentCafeAd(cafeNo, paymentKey);
            SearchResDto responseDto = SearchResDto.CafeAdToSearchResDto(updateCafeAd);
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    //혜리 part-------------------------------------------------------
    @GetMapping("/cafeAd/approvedAds")
    public ResponseEntity<List<CafeAdInterface>> getApprovedAds() {
        try {
        	List<CafeAdInterface> approvedAds = cafeAdService.getApprovedAds();
            return new ResponseEntity<>(approvedAds, HttpStatus.OK);
        } catch (Exception e) {
        	e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    //managerAd 광고 신청 현황
    @GetMapping("/manager/unapprovedAds")
    public ResponseEntity<Object> getUnapprovedAds(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            Page<CafeAdInterface> unapprovedAds = cafeAdService.getUnapprovedAds(PageRequest.of(page, size));
            List<CafeAdInterface> responseList = unapprovedAds.getContent();
            Map<String, Object> res = new HashMap<>();
            res.put("unapprovedAds", unapprovedAds);
            res.put("responseList", responseList);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    //managerAd 승인 버튼
    @PutMapping("/manager/approve/{cafeAdNo}")
    public ResponseEntity<String> approveAd(@PathVariable Integer cafeAdNo) {
        try {
            cafeAdService.approveAd(cafeAdNo);
            return new ResponseEntity<>("카페 광고 승인에 성공했습니다", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("카페 광고 승인에 실패했습니다", HttpStatus.BAD_REQUEST);
        }
    }
    
    @Scheduled(fixedDelay = 7 * 24 * 60 * 60 * 1000, initialDelay = 7 * 24 * 60 * 60 * 1000)
    public void deleteCafeAd() throws Exception {
    	cafeAdService.deleteOldRecords();
    }
}
