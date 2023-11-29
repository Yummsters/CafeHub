package com.yummsters.cafehub.domain.member.mapper;

import com.yummsters.cafehub.domain.member.dto.SignUpReqDto;
import com.yummsters.cafehub.domain.member.dto.SignUpResDto;
import com.yummsters.cafehub.domain.member.entity.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface MemberMapper {

    @Mapping(target = "social", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "memberType", ignore = true)
    Member signUpReqDtoToMember(SignUpReqDto signUpReqDto);

    SignUpResDto memberToSignUpResDto(Member member);
}