package com.yummsters.cafehub.domain.badge.service;

import java.util.List;

import com.yummsters.cafehub.domain.badge.entity.MemberBadges;

public interface BageService {
	
	List<MemberBadges> getBadge(Integer memNo)throws Exception; 
	MemberBadges buyBadge(Integer memNo, Integer badgeNo) throws Exception;

}
