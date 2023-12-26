package com.yummsters.cafehub.domain.cafe.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;

@Repository
public interface CafeRepository extends JpaRepository<Cafe, Integer> {
    Cafe findByCafeNo(Integer cafeNo);
    Cafe findByMember_memNo(Integer memNo);
    Page<Cafe> findByIsPaidFalseAndIsExistingTrueOrderByPaidDate(Pageable pageable);
}