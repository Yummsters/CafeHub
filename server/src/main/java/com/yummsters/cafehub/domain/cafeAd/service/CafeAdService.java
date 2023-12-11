package com.yummsters.cafehub.domain.cafeAd.service;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import org.springframework.web.multipart.MultipartFile;

public interface CafeAdService {
    CafeAd searchCafeAd(Integer cafeNum) throws Exception;
    CafeAd cafeAdSub(CafeAd cafeAd, MultipartFile thumbImg) throws Exception;
}