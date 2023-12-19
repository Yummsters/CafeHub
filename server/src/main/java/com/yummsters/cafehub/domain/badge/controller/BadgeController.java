package com.yummsters.cafehub.domain.badge.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yummsters.cafehub.domain.badge.dto.MemberBadgeDto;
import com.yummsters.cafehub.domain.badge.entity.Badge;
import com.yummsters.cafehub.domain.badge.entity.MemberBadges;
import com.yummsters.cafehub.domain.badge.repository.BadgeRepository;
import com.yummsters.cafehub.domain.badge.service.BageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BadgeController {
	private final BadgeRepository badgeRepository;
	private final BageService bageService;
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
    //구매한 배지 가져오기
    @GetMapping("/bage/{memNo}")
    public ResponseEntity<Object> getBadge(@PathVariable Integer memNo) {
        try {
            List<MemberBadges> memberBadgesList = bageService.getBadge(memNo);

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
            MemberBadges boughtBadge = bageService.buyBadge(memNo, badgeNo);

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

    
}
