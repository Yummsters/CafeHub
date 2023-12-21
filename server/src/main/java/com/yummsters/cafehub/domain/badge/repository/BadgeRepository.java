package com.yummsters.cafehub.domain.badge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.badge.entity.Badge;

public interface BadgeRepository extends JpaRepository<Badge, Integer> {
	boolean existsByBadgeName(String badgeName);
	 Badge findByBadgeNo(Integer badgeNo);
	 List<Badge> findByBadgeNoNot(Integer badgeNo);
	
}
