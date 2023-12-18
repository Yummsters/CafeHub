package com.yummsters.cafehub.domain.badge.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import com.yummsters.cafehub.domain.badge.entity.Badge;
import com.yummsters.cafehub.domain.badge.entity.MemberBadges;
import com.yummsters.cafehub.domain.badge.repository.BadgeRepository;
import com.yummsters.cafehub.domain.badge.repository.MemberBadgeRepository;
import com.yummsters.cafehub.domain.point.service.PointService;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class BageServiceImpl implements BageService {
	 private final BadgeRepository badgeRepository;
	 private final MemberBadgeRepository memberBadgeRepository;
	 private final PointService pointService;
	@Override
	public List<MemberBadges> getBadge(Integer memNo)throws Exception {
	    return memberBadgeRepository.findByMemNo(memNo);
	}
	
	@Override
	public MemberBadges buyBadge(Integer memNo, Integer badgeNo) throws Exception {
	    Optional<Badge> optionalBadge = badgeRepository.findById(badgeNo);

	    if (optionalBadge.isPresent()) {
	        Badge badge = optionalBadge.get(); // 해당 배지 정보를 가져옴

	        // 배지 생성
	        MemberBadges memberBadges = MemberBadges.builder()
	                .memNo(memNo)
	                .badge(badge)
	                .regDate(LocalDateTime.now())
	                .build();
	       
	        // 구매한 배지 저장
	        pointService.pointDown(memberBadges.getMemNo());
	        return memberBadgeRepository.save(memberBadges);
	    } else {
	        throw new Exception("해당 배지를 찾을 수 없습니다.");
	    }
	}


}
