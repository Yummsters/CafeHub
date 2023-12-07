package com.yummsters.cafehub.domain.point.service;

import com.yummsters.cafehub.domain.member.service.MemberService;
import com.yummsters.cafehub.domain.point.entity.Point;
import com.yummsters.cafehub.domain.point.repository.PointRepository;
import com.yummsters.cafehub.domain.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PointServiceImpl implements PointService{
    private final PointRepository pointRepository;
    private final ReviewService reviewService;
    private final MemberService memberService;

    // 포인트 조회
    @Override
    public Point checkPoint(Integer memNo) throws Exception{
        Point point = pointRepository.findByMember_MemNo(memNo);
        if(point == null) throw new Exception("포인트가 존재하지 않습니다.");
        return point;
    }

    // 회원 포인트 적립 및 리뷰 권한 부여
    @Override
    public Integer savePoint(Integer memNo, Integer cafeNo) throws Exception {
        // 포인트 적립
        Point point = checkPoint(memNo);
        point.plusPoint(1);
        pointRepository.save(point);

        // 리뷰 권한 - 테이블 생성 후 로직 작성 예정
        reviewService.reviewAuthPermmit(memNo, cafeNo);

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
        reviewService.reviewAuthPermmit(memNo, cafeNo);
        return storePoint.getPointCount();
    }
}
