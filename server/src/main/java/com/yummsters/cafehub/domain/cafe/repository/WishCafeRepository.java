package com.yummsters.cafehub.domain.cafe.repository;

import com.yummsters.cafehub.domain.cafe.entity.WishCafe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishCafeRepository extends JpaRepository<WishCafe, Integer> {
    boolean existsByMember_memNoAndCafe_cafeNo(Integer memNo, Integer cafeNo); // 특정 회원이 특정 카페를 찜 했는지
    void deleteByMember_memNoAndCafe_cafeNo(Integer memNo, Integer cafeNo); // 찜 취소
}
