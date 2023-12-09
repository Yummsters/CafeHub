package com.yummsters.cafehub.domain.cafe.repository;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CafeRepository extends JpaRepository<Cafe, Integer> {
    Cafe findByCafeNo(Integer cafeNo);
}