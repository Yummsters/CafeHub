package com.yummsters.cafehub.domain.member.mapper;

import com.yummsters.cafehub.domain.member.dto.TokenResDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.yummsters.cafehub.domain.member.dto.DeleteReqDto;
import com.yummsters.cafehub.domain.member.dto.SignUpReqDto;
import com.yummsters.cafehub.domain.member.dto.SignUpResDto;
import com.yummsters.cafehub.domain.member.entity.Member;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface MemberMapper {

    @Mapping(target = "social", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "memberType", ignore = true)
    @Mapping(target = "memNo", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    Member signUpReqDtoToMember(SignUpReqDto signUpReqDto);

    SignUpResDto memberToSignUpResDto(Member member);

    @Mapping(target = "social", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "memberType", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "nickname", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "memNo", ignore = true)
    @Mapping(target = "reviews", ignore = true)
    Member deleteReqDtoToMember(DeleteReqDto deleteReqDto);

    TokenResDto memberToTokenResDto(Member member);
}