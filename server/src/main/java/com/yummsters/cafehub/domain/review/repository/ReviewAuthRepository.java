package com.yummsters.cafehub.domain.review.repository;

import com.yummsters.cafehub.domain.review.entity.ReviewAuth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewAuthRepository extends JpaRepository<ReviewAuth, Integer> {
}