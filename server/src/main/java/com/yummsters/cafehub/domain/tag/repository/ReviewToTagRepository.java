package com.yummsters.cafehub.domain.tag.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.tag.entity.ReviewToTag;

public interface ReviewToTagRepository extends JpaRepository<ReviewToTag, Integer> {
	  List<ReviewToTag> findByReview(Review review);
}
