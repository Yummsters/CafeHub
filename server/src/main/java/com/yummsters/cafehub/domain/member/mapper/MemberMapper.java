package com.yummsters.cafehub.domain.member.mapper;

import com.yummsters.cafehub.domain.member.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.yummsters.cafehub.domain.member.entity.Member;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MemberMapper {

    Member signUpReqDtoToMember(SignUpReqDto signUpReqDto);

    SignUpResDto memberToSignUpResDto(Member member);

    Member deleteReqDtoToMember(DeleteReqDto deleteReqDto);

    Member deleteSocialReqDtoToMember(DeleteSocialDto deleteSocialDto);

    TokenResDto memberToTokenResDto(Member member);

    Member modifyReqDtoToMember(ModifyReqDto modifyReqDto);

    ModifyResDto memberToModifyResDto(Member member);
}