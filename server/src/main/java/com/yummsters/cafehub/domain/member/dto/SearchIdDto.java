package com.yummsters.cafehub.domain.member.dto;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchIdDto {
    private String id;
    private String name;
    private String phone;

    public static SearchIdDto searchIdToDto(Member member) {
        return SearchIdDto.builder()
                .id(member.getId())
                .build();
    }
}
