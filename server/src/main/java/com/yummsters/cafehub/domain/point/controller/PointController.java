package com.yummsters.cafehub.domain.point.controller;

import com.yummsters.cafehub.global.response.MultiResponseDto;
import com.yummsters.cafehub.domain.point.dto.PointCalRes;
import com.yummsters.cafehub.domain.point.entity.Point;
import com.yummsters.cafehub.domain.point.service.PointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/point")
public class PointController {
    @Autowired
    private PointService pointService;

    // 회원 포인트 조회
    @GetMapping("/{memNo}")
    public ResponseEntity<Object> checkPoint(@PathVariable("memNo") Integer memNo){
        try{
            Point pointResponse = pointService.checkPoint(memNo);
            return new ResponseEntity<>(pointResponse.getPointCount(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 회원 포인트 적립 & 리뷰 권한
    @PostMapping ("/save/{memNo}/cafe/{cafeNo}")
    public ResponseEntity<Object> savePointNReview(@PathVariable("memNo") Integer memNo, @PathVariable("cafeNo") Integer cafeNo){
        try{
            Integer pointCountResponse =  pointService.savePoint(memNo, cafeNo);
            return new ResponseEntity<>(pointCountResponse, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 회원 포인트 사용 & 리뷰 권한 & 사장 포인트 적립
    @PostMapping ("/use/{memNo}/cafe/{cafeNo}/{point}")
    public ResponseEntity<Object> savePointNReview(@PathVariable("memNo") Integer memNo,
                                                   @PathVariable("cafeNo") Integer cafeNo, @PathVariable("point") Integer point){
        try{
            Integer pointCountResponse =  pointService.usePoint(memNo, point, cafeNo);
            return new ResponseEntity<>(pointCountResponse, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 사장 포인트 정산 신청
    @PostMapping("/calculate/{memNo}")
    public ResponseEntity<Object> requestPointCal(@PathVariable("memNo") Integer memNo){
        try{
            Integer resPoint = pointService.calPoint(memNo);
            return new ResponseEntity<>(resPoint, HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 포인트 정산 신청 리스트 조회 (페이지네이션)
    @GetMapping("/list")
    public ResponseEntity<Object> pointPermitList(@RequestParam("page") Integer page,
                                                  @RequestParam("size") Integer size){
        try{
            Page<Point> responsePage = pointService.reqPointCal(page-1,size);
            List<Point> responseList = responsePage.getContent();
            List<PointCalRes> responseLists = new ArrayList<>();

            for(Point point : responseList){
                responseLists.add(PointCalRes.pointToPointCalRes(point));
            }

            return new ResponseEntity<>(new MultiResponseDto<>(responseLists, responsePage), HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
