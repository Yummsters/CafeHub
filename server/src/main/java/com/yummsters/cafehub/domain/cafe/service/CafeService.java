package com.yummsters.cafehub.domain.cafe.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.cafe.dto.CafeDto;
import com.yummsters.cafehub.domain.cafe.dto.ModifyCafeDto;
import com.yummsters.cafehub.domain.cafe.entity.Cafe;

public interface CafeService {
    void saveCafe() throws Exception; // 카페 정보 저장
    List<CafeDto> getCafes() throws Exception; // 카페 리스트 불러오기
    CafeDto getCafeByCafeNo(Integer cafeNo) throws Exception; // 카페 하나의 정보 불러오기
    boolean isWishCafe(Integer memNo, Integer cafeNo) throws Exception; // 회원의 리뷰 찜 여부
    boolean toggleWishCafe(Integer memNo, Integer cafeNo) throws Exception; // 찜, 찜 취소
    Cafe searchCafe(Integer cafeNo) throws Exception;
    Page<CafeDto> getUnpaidCafes(Pageable pageable) throws Exception;
    Integer modifyCafe(Integer cafeNo, ModifyCafeDto modifyCafeDto, List<MultipartFile> files)throws Exception;
    Cafe getCafeInfo(Integer cafeNo) throws Exception;
    String getFileName(String thumbImg);
}
