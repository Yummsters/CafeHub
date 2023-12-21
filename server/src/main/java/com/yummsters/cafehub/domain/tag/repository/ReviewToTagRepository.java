package com.yummsters.cafehub.domain.tag.repository;

import com.yummsters.cafehub.domain.tag.entity.ReviewToTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewToTagRepository extends JpaRepository<ReviewToTag, Integer> {
}