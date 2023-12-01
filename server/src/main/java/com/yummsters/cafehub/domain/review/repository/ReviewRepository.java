package com.yummsters.cafehub.domain.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.review.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

}
