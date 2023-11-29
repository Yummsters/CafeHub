package com.yummsters.cafehub.domain.member.service;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.entity.MemberType;
import com.yummsters.cafehub.domain.member.entity.Social;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MemberServiceImpl implements MemberService{
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // 아이디 중복 체크
    @Override
    public boolean existId(String id) throws Exception {
        Member member = memberRepository.findById(id);
        if(member != null) throw new Exception("중복된 아이디입니다");
        return false;
    }

    // 이메일 중복 체크
    @Override
    public boolean existEmail(String email) throws Exception {
        Member member = memberRepository.findByEmail(email);
        if(member != null) throw new Exception("중복된 이메일입니다");
        return false;
    }

    // 닉네임 중복 체크
    public boolean existNickname(String nickname) throws Exception {
        Member member = memberRepository.findByNickname(nickname);
        if(member != null) throw new Exception("중복된 닉네임입니다");
        return false;
    }

    // 사용자 회원가입
    @Override
    public Member existMember(Member member) throws Exception {
        Member checkMember = memberRepository.findByEmail(member.getEmail());
        if(checkMember != null){
            throw new Exception("중복된 회원입니다");
        }

        member = Member.builder()
                    .id(member.getId())
                    .password(bCryptPasswordEncoder.encode(member.getPassword()))
                    .name(member.getName())
                    .nickname(member.getNickname())
                    .memberType(MemberType.USER)
                    .status(true)
                    .email(member.getEmail())
                    .phone(member.getPhone())
                    .social(Social.NORMAL)
                    .build();
        return memberRepository.save(member);
    }

}
