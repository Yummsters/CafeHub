package com.yummsters.cafehub.domain.member.repository;

import com.yummsters.cafehub.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    Member findById(String id);
    Member findByEmail(String email);
    Member findByNickname(String nickname);
    Member findByMemNo(Integer memNo);
    Member findByPhone(String phone);
    Member findByCafe_CafeNo(Integer cafeNo);
    Member findByNameAndPhone(String name, String phone);
}
