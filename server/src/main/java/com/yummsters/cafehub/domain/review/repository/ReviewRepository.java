package com.yummsters.cafehub.domain.review.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.review.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
	//수빈 part ----------------------------------------------------------------
	Review findByReviewNo(Integer reviewNo);
    //혜리 part ----------------------------------------------------------------
//	 @Query("SELECT r FROM Review r ORDER BY r.regDate DESC")
    Page<Review> findAllByOrderByReviewNoDesc(Pageable pageable);
}
