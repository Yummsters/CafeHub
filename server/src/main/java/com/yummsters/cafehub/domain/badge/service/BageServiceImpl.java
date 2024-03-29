package com.yummsters.cafehub.domain.badge.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yummsters.cafehub.domain.badge.dto.MemberBadgeDto;
import com.yummsters.cafehub.domain.badge.entity.Badge;
import com.yummsters.cafehub.domain.badge.entity.MemberBadges;
import com.yummsters.cafehub.domain.badge.repository.BadgeRepository;
import com.yummsters.cafehub.domain.badge.repository.MemberBadgeRepository;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.point.service.PointService;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class BageServiceImpl implements BageService {
	 private final BadgeRepository badgeRepository;
	 private final MemberBadgeRepository memberBadgeRepository;
	 private final PointService pointService;
	 private final MemberRepository memberRepository;
	@Override
	public List<MemberBadges> getBadge(Integer memNo){
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
	@Override
	public MemberBadges pickBadge(Integer memNo, Integer memberBadgeNo) throws Exception {
	    Optional<Member> optionalMember = memberRepository.findById(memNo);

	    if (optionalMember.isPresent()) {
	        Member member = optionalMember.get();

	        MemberBadges memberBadges = memberBadgeRepository.findById(memberBadgeNo)
	                .orElseThrow(() -> new Exception("해당 배지를 찾을 수 없습니다."));

	        Integer badgeNo = memberBadges.getBadge().getBadgeNo();
	        member.setBadgeNo(badgeNo);

	        memberRepository.save(member); 

	        return memberBadges;
	    } else {
	        throw new Exception("해당 사용자를 찾을 수 없습니다.");
	    }
	}
	@Override
	 public MemberBadgeDto getMemberBadge(Integer memNo) throws Exception {
        try {
            Optional<Member> optionalMember = memberRepository.findById(memNo);

            if (optionalMember.isPresent()) {
                Member member = optionalMember.get();

                Integer badgeNo = member.getBadgeNo();
              
                Optional<Badge> optionalBadge = badgeRepository.findById(badgeNo);
                
                if (optionalBadge.isPresent()) {
                    Badge badge = optionalBadge.get();

                    MemberBadgeDto memberBadgeDto = new MemberBadgeDto();
                    memberBadgeDto.setMemNo(memNo);
                    memberBadgeDto.setBadgeNo(badgeNo);
                    memberBadgeDto.setBadgeName(badge.getBadgeName());

                    return memberBadgeDto;
                } else {
                    throw new Exception("해당 배지를 찾을 수 없습니다.");
                }
            } else {
                throw new Exception("해당 사용자를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            throw new Exception("서비스에서 오류 발생: " + e.getMessage());
        }
    }
	@Override
	public Member defaultBadge(Integer memNo) throws Exception {
	    Optional<Member> optionalMember = memberRepository.findById(memNo);

	    if (optionalMember.isPresent()) {
	        Member member = optionalMember.get();
	        member.setBadgeNo(9);
	        memberRepository.save(member);

	        return member;
	    } else {
	        throw new Exception("해당 사용자를 찾을 수 없습니다.");
	    }
	}
}






