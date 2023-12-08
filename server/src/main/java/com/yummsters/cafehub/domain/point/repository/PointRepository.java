package com.yummsters.cafehub.domain.point.repository;

import com.yummsters.cafehub.domain.point.entity.Point;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointRepository extends JpaRepository<Point, Integer> {
    Point findByMember_MemNo(Integer memNo);
}