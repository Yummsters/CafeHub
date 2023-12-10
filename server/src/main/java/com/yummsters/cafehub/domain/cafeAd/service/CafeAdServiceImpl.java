package com.yummsters.cafehub.domain.cafeAd.service;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.cafeAd.repository.CafeAdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CafeAdServiceImpl implements CafeAdService{

    @Autowired
    private CafeAdRepository cafeAdRepository;

    // 광고 신청 조회
    @Override
    public CafeAd searchCafeAd(Integer cafeNum) throws Exception{
        CafeAd cafeAd = cafeAdRepository.findByCafe_CafeNo(cafeNum);
        if(cafeAd == null) throw new Exception("신청된 광고가 없습니다.");
        return cafeAd;
    }
}
