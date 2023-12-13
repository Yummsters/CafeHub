package com.yummsters.cafehub.domain.member.service;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.cafe.repository.CafeRepository;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.entity.MemberType;
import com.yummsters.cafehub.domain.member.entity.Social;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.point.entity.Point;
import com.yummsters.cafehub.domain.point.repository.PointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final PointRepository pointRepository;
    private final CafeRepository cafeRepository;

    // 아이디 중복 체크
    @Override
    public boolean existId(String id) throws Exception {
        Member member = memberRepository.findById(id);
        if(member != null) return true;
        return false;
    }

    // 이메일 중복 체크
    @Override
    public boolean existEmail(String email) throws Exception {
        Member member = memberRepository.findByEmail(email);
        if(member != null) return true;
        return false;
    }

    // 닉네임 중복 체크
    public boolean existNickname(String nickname) throws Exception {
        Member member = memberRepository.findByNickname(nickname);
        if(member != null) return true;
        return false;
    }

    // 사용자 회원가입
    @Override
    public Member existMember(Member member) throws Exception {
        Member checkMember = memberRepository.findByEmail(member.getEmail());
        if(checkMember != null){
            throw new Exception("중복된 회원입니다");
        }

        // 회원 정보 생성
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

        memberRepository.save(member);

        member = memberRepository.findById(member.getId());
        System.out.println(member);

        // 포인트 정보 생성
        Point point = Point.builder()
                .member(member)
                .build();

        pointRepository.save(point);
        return member;
    }

    // 사용자, 사장 회원탈퇴
    @Override
    public Boolean deleteMember(Integer memNo, String password) throws Exception {
        Member member = memberRepository.findByMemNo(memNo);
        if(member == null){
            throw new Exception("존재하지 않는 회원입니다.");
        }
        if(!member.getSocial().equals(Social.NORMAL)){
            throw new Exception("웹사이트 자체 회원이 아닙니다. 소셜 탈퇴를 이용하세요.");
        }
        boolean match = bCryptPasswordEncoder.matches(password, member.getPassword());
        if(!match){
            return false;
        }

        // 사용자 회원(포인트 삭제 및 회원 정보 삭제)
        if(member.getMemberType().equals(MemberType.USER)){
            deleteUser(member);
        }

        // 사장 회원(포인트 확인 후 삭제, 카페 상태 변경, 회원 정보 삭제)
        if(member.getMemberType().equals(MemberType.STORE)){
            deleteStore(member);
        }

        member.deleteMember();
        memberRepository.save(member);
        return true;
    }

    // 사용자 회원 탈퇴 로직
    public void deleteUser(Member member){
        Point point = pointRepository.findByMember_MemNo(member.getMemNo());
        point.deletePoint();
        pointRepository.save(point);
    }

    // 사장 회원 탈퇴 로직
    public void deleteStore(Member member) throws Exception{
        Point point = pointRepository.findByMember_MemNo(member.getMemNo());
        if(point.getPointCount() >= 100){
            throw new Exception("포인트 정산 후 탈퇴가 가능합니다.");
        }else{
            if(point.getRefPointCount() != 0){
                throw new Exception("정산 대기중인 포인트가 있습니다. 포인트 정산 후 탈퇴가 가능합니다.");
            }
            point.deletePoint();
            pointRepository.save(point);
        }

        Cafe cafe = cafeRepository.findByCafeNo(member.getCafe().getCafeNo());
        cafe.deleteCafe();
        cafeRepository.save(cafe);
    }

    // 소셜 회원탈퇴
    @Override
    public Boolean deleteSocialMember(Integer memNo, String email) throws Exception {
        Member member = memberRepository.findByMemNo(memNo);
        if(member == null){
            throw new Exception("존재하지 않는 회원입니다.");
        }
        if(member.getSocial().equals(Social.NORMAL)){
            throw new Exception("웹사이트 자체 회원입니다. 소셜 탈퇴를 이용하세요.");
        }
        boolean match = member.getEmail().equals(email);

        if(!match){
            return false;
        }

        deleteUser(member);
        member.deleteMember();
        memberRepository.save(member);
        return true;
    }

    // 휴대폰 번호로 회원 조회
    @Override
    public Member phoneSearch(String phone) throws Exception {
        Member member = memberRepository.findByPhone(phone);
        if(member == null) throw new Exception("존재하지 않는 회원입니다.");
        return member;
    }

    // cafeNo로 회원 조회
    @Override
    public Member storeSearch(Integer cafeNo) throws Exception {
        Member member = memberRepository.findByCafe_CafeNo(cafeNo);
        if(member == null) throw new Exception("존재하지 않는 회원입니다.");
        return member;
    }

    // 선진 part ----------------------------------------------------------
    // 아이디 찾기
    @Override
    public String searchId(String name, String phone) throws Exception {
        Member member = memberRepository.findByNameAndPhone(name, phone);
        if(member == null) throw new Exception("회원정보가 일치하지 않습니다.");
        return member.getId();
    }
}
