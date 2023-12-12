package com.yummsters.cafehub.domain.point.repository;

import com.yummsters.cafehub.domain.point.entity.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointRepository extends JpaRepository<Point, Integer> {
    Point findByMember_MemNo(Integer memNo);
    Page<Point> findAllByIsRefundTrue(PageRequest pageRequest);
}