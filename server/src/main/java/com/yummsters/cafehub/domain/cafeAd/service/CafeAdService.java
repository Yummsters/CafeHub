package com.yummsters.cafehub.domain.cafeAd.service;

import java.util.List;

import com.yummsters.cafehub.domain.payment.entity.Payment;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;

public interface CafeAdService {
    CafeAd searchCafeAd(Integer cafeNum) throws Exception;
    CafeAd cafeAdSub(CafeAd cafeAd, MultipartFile thumbImg) throws Exception;
    // 선진 part-------------------------------------------------------
    boolean deleteCafeAd(Integer cafeNo) throws Exception;
    CafeAd paymentCafeAd(Integer cafeNo, String paymentKey) throws Exception;
  //혜리 part-------------------------------------------------------
    List<CafeAd> getApprovedAds() throws Exception;
}