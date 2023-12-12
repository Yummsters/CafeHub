package com.yummsters.cafehub.domain.point.service;

import com.yummsters.cafehub.domain.point.entity.Point;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PointService {
    Point checkPoint(Integer memNo) throws Exception;
    Integer savePoint(Integer memNo, Integer cafeNo) throws Exception;
    Integer usePoint(Integer memNo, Integer usePoint, Integer storeNo) throws Exception;
    void reviewAuthPermmit(Integer memNo, Integer cafeNo) throws Exception; //
    Integer calPoint(Integer memNo) throws Exception;
    Page<Point> reqPointCal(Integer page, Integer size) throws Exception;
    void pointUp(Integer memNo) throws Exception;	//회원 포인트 적립
    boolean permitPoint(Integer memNo) throws Exception;
}