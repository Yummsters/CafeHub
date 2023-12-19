package com.yummsters.cafehub.domain.badge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.badge.entity.MemberBadges;

public interface MemberBadgeRepository extends JpaRepository<MemberBadges, Integer> {
//	 MemberBadges findByMemberBadgeNo(Integer memberBadgeNo);
	 List<MemberBadges> findByMemNo(Integer memNo);
	 Optional<MemberBadges> findById(Integer badgeNo);
}
