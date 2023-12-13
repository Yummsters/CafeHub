package com.yummsters.cafehub.domain.cafe.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;

@Repository
public interface CafeRepository extends JpaRepository<Cafe, Integer> {
    Cafe findByCafeNo(Integer cafeNo);
    //혜리 작성 부분
    Page<Cafe> findByIsPaidFalseOrderByPaidDate(Pageable pageable);
}