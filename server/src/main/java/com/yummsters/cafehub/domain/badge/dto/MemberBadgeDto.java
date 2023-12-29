package com.yummsters.cafehub.domain.badge.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberBadgeDto {
	 
	    private Integer memberBadgeNo;	  
	    private Integer memNo;
	    private Integer badgeNo;
	    private String badgeName;
	    private LocalDateTime regDate;
}
