package com.yummsters.cafehub.domain.badge.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yummsters.cafehub.domain.badge.dto.MemberBadgeDto;
import com.yummsters.cafehub.domain.badge.entity.Badge;
import com.yummsters.cafehub.domain.badge.entity.MemberBadges;
import com.yummsters.cafehub.domain.badge.repository.BadgeRepository;
import com.yummsters.cafehub.domain.badge.repository.MemberBadgeRepository;
import com.yummsters.cafehub.domain.badge.service.BageService;
import com.yummsters.cafehub.domain.member.dto.DefaultBadgeDto;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BadgeController {
	private final BadgeRepository badgeRepository;
	private final MemberBadgeRepository memberBadgeRepository;
	private final BageService badgeService;
    private final MemberRepository memberRepository;
    private final DefaultBadgeDto defaultBadgeDto;
    //배지만들기
    @PostMapping("/bage/{badgeName}")
    public void BadgeName(@PathVariable("badgeName") String badgeName) throws Exception {
        if(!badgeRepository.existsByBadgeName(badgeName)){
            Badge badge = Badge.builder()
                    .badgeName(badgeName)
                    .build();
            badgeRepository.save(badge);
        } else {
            throw new Exception("이미 존재하는 배지");
        }
    }
   
    //배지 목록 조회
    @GetMapping("/badgeList")
    public ResponseEntity<Object> badgeList() {
        
        List<Badge> responseList = badgeRepository.findByBadgeNoNot(9);

        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }
  
    //구매한 배지 가져오기
    @GetMapping("/badge/{memNo}")
    public ResponseEntity<Object> getBadge(@PathVariable Integer memNo) {
        try {
            List<MemberBadges> memberBadgesList = badgeService.getBadge(memNo);
           
            if (!memberBadgesList.isEmpty()) {
                List<MemberBadgeDto> memberBadgeDtoList = memberBadgesList.stream()
                        .map(MemberBadges::toDTO)
                        .collect(Collectors.toList());

                return new ResponseEntity<>(memberBadgeDtoList, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    //배지 구매하기
    @PostMapping("/buyBadge/{memNo}/{badgeNo}")
    public ResponseEntity<Object> buyBadge(@PathVariable Integer memNo, @PathVariable Integer badgeNo) {
        try {
            MemberBadges boughtBadge = badgeService.buyBadge(memNo, badgeNo);

            if (boughtBadge != null) {
                MemberBadgeDto memberBadgeDto = boughtBadge.toDTO();
                return new ResponseEntity<>(memberBadgeDto, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    
    }
    //배지 선택하기
    @PostMapping("/pickBadge/{memNo}/{badgeNo}")
    public ResponseEntity<Object> pickBadge(@PathVariable Integer memNo, @PathVariable Integer badgeNo) {
        try {
            MemberBadges boughtBadge = badgeService.pickBadge(memNo, badgeNo);

            if (boughtBadge != null) {
                MemberBadgeDto memberBadgeDto = boughtBadge.toDTO();

                return new ResponseEntity<>(memberBadgeDto, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
  //회원 배지 불러오기
    @GetMapping("/getMemberBadge/{memNo}")
    public ResponseEntity<Object> getMemberBadge(@PathVariable Integer memNo) {
        try {
            MemberBadgeDto memberBadgeDto = badgeService.getMemberBadge(memNo);
            return new ResponseEntity<>(memberBadgeDto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    } 
    //배지 30일 만료  
    @Scheduled(fixedDelay = 10_800_000) // 하루 86_400_000
    public void deleteBadges() {
        try {
            List<MemberBadges> list = memberBadgeRepository.findAllByRegDateIsBefore(LocalDateTime.now().minusDays(30));
            for (MemberBadges memberBadges : list) {
                Integer memberBadge = memberRepository.findByMemNo(memberBadges.getMemNo()).getBadgeNo();
                Integer memberBadgesBadge = memberBadges.getBadgeNo();
                if (memberBadge.equals(memberBadgesBadge)) {
                    // 동일한 경우
                	Badge defaultBadge = badgeRepository.findByBadgeNo(9); 
                	Member member = memberRepository.findByMemNo(memberBadges.getMemNo());
                	member.setBadgeNo(defaultBadge.getBadgeNo()); // 기본 배지로 설정
                	memberRepository.save(member);
                	memberBadgeRepository.delete(memberBadges); //members에있는 배지 지움
                } else {
                	 memberBadgeRepository.delete(memberBadges);
                	 
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    //기본배지선택
    @PostMapping("/defaultBadge/{memNo}")
    public ResponseEntity<Object> defaultBadge(@PathVariable Integer memNo) {
        try {
            Member member = badgeService.defaultBadge(memNo);

            if (member != null) {
            	DefaultBadgeDto defaultBadgeDto = member.toDTO();  // MemberDto를 사용하는 경우에 대한 가정입니다.

                return new ResponseEntity<>(defaultBadgeDto, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }



    

    
}
