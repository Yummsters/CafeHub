package com.yummsters.cafehub.domain.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.review.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    Review findByReviewNo(Integer reviewNo);
    //혜리 part ----------------------------------------------------------------
    List<Review> findAllByOrderByRegDateDesc();
}
