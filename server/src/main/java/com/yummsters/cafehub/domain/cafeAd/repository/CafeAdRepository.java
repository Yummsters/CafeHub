package com.yummsters.cafehub.domain.cafeAd.repository;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yummsters.cafehub.domain.cafeAd.dto.CafeAdInterface;
import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;

public interface CafeAdRepository extends JpaRepository<CafeAd, Integer> {
    CafeAd findByCafe_CafeNo(Integer cafeNo);
  //혜리 part-------------------------------------------------------
    @Query(value = "SELECT c.cafe_name AS cafeName, "
    		+ "c.address AS address, "
    		+ "ca.file_num AS fileNum, "
    		+ "ca.description AS description, "
    		+ "ca.menu AS menu, "
    		+ "ca.auth_date AS authDate "
    		+ "FROM cafe_ad ca "
    		+ "JOIN cafe c ON ca.cafe_no = c.cafe_no "
    		+ "WHERE ca.is_approved = 1 "
    		+ "ORDER BY ca.auth_date LIMIT 3", nativeQuery = true)
    List<CafeAdInterface> findApprovedAds();
    
    @Query(value = "SELECT c.cafe_name AS cafeName, "
    		+ "ca.file_num AS fileNum, "
            + "ca.description AS description, "
            + "ca.menu AS menu, "
            + "ca.reg_date AS regDate, "
            + "ca.cafe_ad_no AS cafeAdNo "
            + "FROM cafe_ad ca "
            + "JOIN cafe c ON ca.cafe_no = c.cafe_no "
            + "WHERE ca.is_approved = 0 AND ca.is_paid = 1 "
            + "ORDER BY ca.reg_date", nativeQuery = true)
     Page<CafeAdInterface> findUnapprovedAds(Pageable pageable);
    
    @Transactional
    @Modifying
    @Query(value = "UPDATE cafe_ad ca SET ca.is_approved AS isApproved = true, ca.auth_date AS authDate = CURRENT_TIMESTAMP "
    		+ "WHERE ca.cafe_ad_no AS cafeAdNo = :cafeAdNo", nativeQuery = true)
    void approveAd(@Param("cafeAdNo") Integer cafeAdNo);
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM cafe_ad ca WHERE ca.auth_date < :sevenDaysAgo", nativeQuery = true)
    void deleteOldRecords(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);
}