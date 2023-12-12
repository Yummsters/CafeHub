package com.yummsters.cafehub.domain.cafe.service;

import com.yummsters.cafehub.domain.cafe.dto.CafeDto;
import com.yummsters.cafehub.domain.cafe.entity.Cafe;

import java.util.List;

public interface CafeService {
    // 선진 part---------------------------------------------------------------------------
    void saveCafe() throws Exception; // 카페 정보 저장
    List<CafeDto> getCafes() throws Exception; // 카페 리스트 불러오기
    CafeDto getCafeByCafeNo(Integer cafeNo) throws Exception; // 카페 하나의 정보 불러오기
    boolean isWishCafe(Integer memNo, Integer cafeNo) throws Exception; // 회원의 리뷰 찜 여부
    boolean toggleWishCafe(Integer memNo, Integer cafeNo) throws Exception; // 찜, 찜 취소
    Cafe searchCafe(Integer cafeNo) throws Exception;
}
