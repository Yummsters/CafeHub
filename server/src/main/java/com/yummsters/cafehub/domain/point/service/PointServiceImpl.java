package com.yummsters.cafehub.domain.point.service;

import com.yummsters.cafehub.domain.cafe.repository.CafeRepository;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.review.entity.ReviewAuth;
import com.yummsters.cafehub.domain.review.repository.ReviewAuthRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.yummsters.cafehub.domain.member.service.MemberService;
import com.yummsters.cafehub.domain.point.entity.Point;
import com.yummsters.cafehub.domain.point.repository.PointRepository;

import lombok.RequiredArgsConstructor;

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
        storePoint.plusStorePoint(usePoint/100);

        // 리뷰 권한 - 테이블 생성 후 로직 작성 예정
        reviewAuthPermmit(memNo, cafeNo);
        return memberPoint.getPointCount();
    }

    // 사장 포인트 정산
    @Override
    public Integer calPoint(Integer memNo) throws Exception {
        // 포인트 확인
        Point storePoint = checkPoint(memNo);
        if(storePoint.getPointCount() < 100) throw new Exception("포인트 정산은 100개 이상부터 가능합니다");

        // 전체 포인트 정산 및 신청일 업데이트
        storePoint.calPoint(storePoint.getPointCount());
        pointRepository.save(storePoint);

        return storePoint.getPointCount();
    }
  
    // 정산 신청 목록 조회
    @Override
    public Page<Point> reqPointCal(Integer page, Integer size) throws Exception{
        return pointRepository.findAllByIsRefundTrue(PageRequest.of(page, size, Sort.by("refDate").descending()));
    }

  // 회원 포인트 적립
    @Override
    public void pointUp(Integer memNo) throws Exception {
    	 try {
    	        Point point = checkPoint(memNo);
    	        point.plusPoint(1);
    	        pointRepository.save(point);
    	    } catch (Exception e) {
    	        e.printStackTrace(); 
    	    }
    }
    //회원 포인트 사용
    @Override
    public void pointDown(Integer memNo) throws Exception {
    	try {
    		Point point = checkPoint(memNo);
    		point.usePoint(10);
    		pointRepository.save(point);
    	} catch (Exception e) {
    		e.printStackTrace();
    		 throw e;
    	}
    }

    // 포인트 정산 신청 승인
    @Override
    public boolean permitPoint(Integer memNo) throws Exception {
        Point point = pointRepository.findByMember_MemNo(memNo);
        if(point == null) return false;
        point.permitPoint();
        pointRepository.save(point);
        return true;
    }

    // 포인트 구매
    @Override
    public void buyPoint(Integer memNo, Integer price) throws Exception {
        Point point = checkPoint(memNo);
        point.plusPoint(price);
        pointRepository.save(point);
    }
}
