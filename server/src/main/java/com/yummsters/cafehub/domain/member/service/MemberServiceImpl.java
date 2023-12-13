package com.yummsters.cafehub.domain.member.service;

import com.yummsters.cafehub.domain.member.dto.ModifyReqDto;
import com.yummsters.cafehub.domain.member.dto.ModifyResDto;

import java.io.File;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.cafe.dto.CafeDto;
import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.cafe.repository.CafeRepository;
import com.yummsters.cafehub.domain.file.service.FileService;
import com.yummsters.cafehub.domain.member.dto.SearchPwDto;
import com.yummsters.cafehub.domain.member.dto.SignUpStoreDto;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.entity.MemberType;
import com.yummsters.cafehub.domain.member.entity.Social;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.point.entity.Point;
import com.yummsters.cafehub.domain.point.repository.PointRepository;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.entity.FileVo;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.repository.FileVoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final PointRepository pointRepository;  
    private final CafeRepository cafeRepository;
    private final FileVoRepository fileVoRepository;
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
        // 추후 사장 회원의 경우 커피콩 개수에 따른 Exception 발생 필요
        member.changeStatus(false);
        memberRepository.save(member);
        return true;
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
        member.changeStatus(false);
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
    public Member searchId(String name, String phone) throws Exception {
        Member member = memberRepository.findByNameAndPhone(name, phone);
        if(member == null) throw new Exception("회원정보가 일치하지 않습니다.");
        return member;
    }

    // 비밀번호 찾기
    @Override
    public Member searchPw(String id, String phone) throws Exception {
        Member member = memberRepository.findById(id);
        if (member != null && member.getPhone().equals(phone)) {
            return member;
        } else {
            throw new Exception("회원정보가 일치하지 않습니다.");
        }
    }
    // 비밀번호 재설정
    @Override
    public void changePw(String id, String newPassword) throws Exception {
        Member member = memberRepository.findById(id);
        if(member != null) {
            member.changePassword(bCryptPasswordEncoder.encode(newPassword));
            memberRepository.save(member);
        } else {
            throw new Exception("회원정보가 일치하지 않습니다.");
        }
    }
  
    // 회원정보 수정
    @Override
    public Member modifyMember(Member member) throws Exception {
        Member modifyMember = memberRepository.findById(member.getId());
        if(modifyMember == null) throw new Exception("존재하지 않는 회원입니다.");

        if (member.getName() != null && !member.getName().isEmpty()) {
            modifyMember.setName(member.getName());
        }
        if (member.getEmail() != null && !member.getEmail().isEmpty()) {
            modifyMember.setEmail(member.getEmail());
        }
        if (member.getNickname() != null && !member.getNickname().isEmpty()) {
            modifyMember.setNickname(member.getNickname());
        }
        if (member.getPhone() != null && !member.getPhone().isEmpty()) {
            modifyMember.setPhone(member.getPhone());
        }
        if (member.getPassword() != null && !member.getPassword().isEmpty()) {
            modifyMember.setPassword(member.getPassword());
        }
        memberRepository.save(modifyMember);
        return modifyMember;
    }
    // 수빈 part ----------------------------------------------------------
    //카페정보생성
    @Override
    public Integer existStore(SignUpStoreDto signUpStore, List<MultipartFile> files) throws Exception {
        try {
            if (files != null && !files.isEmpty()) {
                String dir = "c:/soobin/upload/"; // 업로드 경로
                // String dir = "/Users/gmlwls/Desktop/kosta/upload/"; // 다른 업로드 경로

                String fileNums = "";

                for (MultipartFile file : files) {
                    FileVo fileVo = FileVo.builder()
                            .directory(dir)
                            .name(file.getOriginalFilename())
                            .size(file.getSize())
                            .contenttype(file.getContentType())
                            .data(file.getBytes())
                            .build();

                    fileVoRepository.save(fileVo);
                    File uploadFile = new File(dir + fileVo.getFileNum());
                    System.out.println("파일 경로: " + uploadFile.getAbsolutePath());

                    file.transferTo(uploadFile);

                    // 파일 번호 목록 만들기
                    if (!fileNums.isEmpty()) {
                        fileNums += ",";
                    }
                    fileNums += fileVo.getFileNum();
                }

                System.out.println("카페 이름: " + signUpStore.getCafeName());
                System.out.println("전화번호: " + signUpStore.getTel());

                Cafe cafeEntity = Cafe.builder()
                        .cafeName(signUpStore.getCafeName())
                        .tel(signUpStore.getTel())
                        .businessNo(signUpStore.getBusinessNo())
                        .address(signUpStore.getAddress())
                        .operTime(signUpStore.getOperTime())
                        .thumbImg(fileNums)
                        .build();

                System.out.println("카페 엔터티: " + cafeEntity);

                cafeRepository.save(cafeEntity);
                System.out.println("저장된 카페 엔터티: " + cafeEntity);

                
                Integer cafeNo = cafeEntity.getCafeNo();

                return cafeNo;
            }
        } catch (Exception e) {
            throw new Exception("카페 엔터티 저장에 실패했습니다", e);
        }

        return null;
    }

    //사장님 회원가입
    @Override
    public Member existStoreMember(Member member) throws Exception {
        Member checkMember = memberRepository.findByEmail(member.getEmail());
        if(checkMember != null){
            throw new Exception("중복된 회원입니다");
        }

        Cafe cafe = member.getCafe();
        // 회원 정보 생성
        member = Member.builder()
                .id(member.getId())
                .password(bCryptPasswordEncoder.encode(member.getPassword()))
                .name(member.getName())
                .nickname(member.getNickname())
                .memberType(MemberType.STORE)
                .status(true)
                .email(member.getEmail())
                .phone(member.getPhone())
                .social(Social.NORMAL)
                .build();

        memberRepository.save(member);
        Integer cafeno = cafe.getCafeNo();
        // Member에 cafeNo 저장
        member.setCafeno(cafeno);
        memberRepository.save(member);

        // 포인트 정보 생성
        Point point = Point.builder()
                .member(member)
                .build();

        pointRepository.save(point);
        return member;
    }

}
