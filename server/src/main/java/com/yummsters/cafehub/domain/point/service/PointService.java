package com.yummsters.cafehub.domain.point.service;

import com.yummsters.cafehub.domain.point.entity.Point;

public interface PointService {
    Point checkPoint(Integer memNo) throws Exception;
    Integer savePoint(Integer memNo, Integer cafeNo) throws Exception;
    Integer usePoint(Integer memNo, Integer usePoint, Integer storeNo) throws Exception;
    Integer calPoint(Integer memNo) throws Exception;
    

    void pointUp(Integer memNo) throws Exception;	//회원 포인트 적립      
}