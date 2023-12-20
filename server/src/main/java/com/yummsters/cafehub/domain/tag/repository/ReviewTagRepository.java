package com.yummsters.cafehub.domain.tag.repository;

import com.yummsters.cafehub.domain.tag.entity.ReviewTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewTagRepository extends JpaRepository<ReviewTag, Integer> {
    boolean existsByTagName(String tagName);
    ReviewTag findByTagNo(Integer tagNo);
}