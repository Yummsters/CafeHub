package com.yummsters.cafehub.domain.cafeAd.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;

public interface CafeAdRepository extends JpaRepository<CafeAd, Integer> {
    CafeAd findByCafe_CafeNo(Integer cafeNo);
  //혜리 part-------------------------------------------------------
    List<CafeAd> findByIsApprovedAndAuthDateBefore(boolean isApproved, LocalDateTime authDate);
}