package com.yummsters.cafehub.domain.point.service;

import com.yummsters.cafehub.domain.cafe.repository.CafeRepository;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.review.entity.ReviewAuth;
import com.yummsters.cafehub.domain.review.repository.ReviewAuthRepository;
import org.springframework.stereotype.Service;

import com.yummsters.cafehub.domain.member.service.MemberService;
import com.yummsters.cafehub.domain.point.entity.Point;
import com.yummsters.cafehub.domain.point.repository.PointRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor

public class PointServiceImpl implements PointService{
    private final PointRepository pointRepository;
    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final CafeRepository cafeRepository;
    private final ReviewAuthRepository reviewAuthRepository;
   
    // 포인트 조회
    @Override
    public Point checkPoint(Integer memNo) throws Exception{
        Point point = pointRepository.findByMember_MemNo(memNo);
        if(point == null) throw new Exception("포인트가 존재하지 않습니다.");
        return point;
    }

    // 리뷰 권한 부여
    @Override
    public void reviewAuthPermmit(Integer memNo, Integer cafeNo) throws Exception {
        ReviewAuth reviewAuth = ReviewAuth.builder()
                .member(memberRepository.findByMemNo(memNo))
                .cafe(cafeRepository.findByCafeNo(cafeNo))
                .build();
        reviewAuthRepository.save(reviewAuth);
    }

    // 회원 포인트 적립 및 리뷰 권한 부여
    @Override
    public Integer savePoint(Integer memNo, Integer cafeNo) throws Exception {
        // 포인트 적립
        Point point = checkPoint(memNo);
        point.plusPoint(1);
        pointRepository.save(point);
        // 리뷰 권한 - 테이블 생성 후 로직 작성 예정
        reviewAuthPermmit(memNo, cafeNo);

        return point.getPointCount();
    }

    // 회원 포인트 사용 및 리뷰 권한 부여
    // 사용 포인트 사장 포인트로 전환
    @Override
    public Integer usePoint(Integer memNo, Integer usePoint, Integer cafeNo) throws Exception {
        // 포인트 사용
        Point memberPoint = checkPoint(memNo);
        memberPoint.usePoint(usePoint/100);

        // 사장 포인트로 전환
        Integer cafeMemNo = memberService.storeSearch(cafeNo).getMemNo();
        Point storePoint = checkPoint(cafeMemNo);
        storePoint.plusPoint(usePoint/100);

        // 리뷰 권한 - 테이블 생성 후 로직 작성 예정
        reviewAuthPermmit(memNo, cafeNo);
        return storePoint.getPointCount();
    }

    // 사장 포인트 정산
    @Override
    public Integer calPoint(Integer memNo) throws Exception {
        // 포인트 확인
        Point storePoint = checkPoint(memNo);
        if(storePoint.getPointCount() < 100) throw new Exception("포인트 정산은 100개 이상부터 가능합니다");

        // 전체 포인트 정산 및 신청일 업데이트
        storePoint.calPoint();
        pointRepository.save(storePoint);

        return storePoint.getPointCount();
    }
  
    // 정산 신청 목록 조회
    @Override
    public List<Point> reqPointCal() throws Exception{
        List<Point> responseList = pointRepository.findAllByIsRefundTrue();
        if(responseList == null || responseList.isEmpty()) throw new Exception("포인트 정산 신청 없음");
        return responseList;
    }

  // 회원 포인트 적립
    @Override
    public void pointUp(Integer memNo) throws Exception {
    	 try {
    		 System.out.println("포인트성공했나");
    	        Point point = checkPoint(memNo);
    	        point.plusPoint(1);
    	        pointRepository.save(point);
    	    } catch (Exception e) {
    	    	 System.out.println("실패한건가...");
    	        e.printStackTrace(); 
    	    }
    }
}
