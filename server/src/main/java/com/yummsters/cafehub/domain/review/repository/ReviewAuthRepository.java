package com.yummsters.cafehub.domain.review.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.review.entity.ReviewAuth;

public interface ReviewAuthRepository extends JpaRepository<ReviewAuth, Integer> {

	List<ReviewAuth> findByMember_MemNo(Integer memNo);
	ReviewAuth findByReviewAuthNo(Integer reviewAuthNo);
	void deleteAllByRegDateIsBefore(LocalDateTime localDateTime);
	List<ReviewAuth> findByRegDateIsBefore(LocalDateTime localDateTime);
	
}