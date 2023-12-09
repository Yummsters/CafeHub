package com.yummsters.cafehub.domain.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.review.entity.ReviewAuth;

public interface ReviewAuthRepository extends JpaRepository<ReviewAuth, Integer> {
	List<ReviewAuth> findByMember_memNo(Integer memNo);
}