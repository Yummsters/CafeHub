package com.yummsters.cafehub.domain.badge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.badge.entity.Badge;
import com.yummsters.cafehub.domain.badge.entity.MemberBadges;

public interface BadgeRepository extends JpaRepository<Badge, Integer> {
	boolean existsByBadgeName(String badgeName);
	 Badge findByBadgeNo(Integer badgeNo);
	
}
