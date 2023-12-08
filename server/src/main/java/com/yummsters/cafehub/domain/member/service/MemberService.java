package com.yummsters.cafehub.domain.member.service;

import com.yummsters.cafehub.domain.member.entity.Member;
import org.springframework.stereotype.Service;

public interface MemberService {
    boolean existId(String id) throws Exception;
    boolean existEmail(String email) throws Exception;
    boolean existNickname(String nickname) throws Exception;
    Member existMember(Member member) throws Exception;
    Boolean deleteMember(Integer memNo, String password) throws  Exception;
    Boolean deleteSocialMember(Integer memNo, String email) throws  Exception;
    Member phoneSearch(String phone) throws Exception;
    Member storeSearch(Integer cafeNo) throws Exception;
}
