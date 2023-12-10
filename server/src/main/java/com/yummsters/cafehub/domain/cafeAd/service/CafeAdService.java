package com.yummsters.cafehub.domain.cafeAd.service;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;

public interface CafeAdService {
    CafeAd searchCafeAd(Integer cafeNum) throws Exception;
}