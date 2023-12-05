package com.yummsters.cafehub.domain.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.review.entity.Review;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    Review findByReviewNo(Integer reviewNo);
}
