package com.yummsters.cafehub.domain.member.mapper;

import com.yummsters.cafehub.domain.member.dto.MemberSignUpDto;
import com.yummsters.cafehub.domain.member.entity.Member;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MemberMapper {
    Member memberSignUpDtoToMember(MemberSignUpDto memberSignUpDto);
    MemberSignUpDto memberToMemberSignUpDto(Member member);
}