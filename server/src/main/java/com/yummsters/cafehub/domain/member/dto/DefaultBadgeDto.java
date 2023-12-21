package com.yummsters.cafehub.domain.member.dto;

import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class DefaultBadgeDto {
    private Integer memNo;
    private Integer badgeNo;
    
    
}
