package com.yummsters.cafehub.domain.cafeAd.repository;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CafeAdRepository extends JpaRepository<CafeAd, Integer> {
    CafeAd findByCafe_CafeNo(Integer cafeNo);
}