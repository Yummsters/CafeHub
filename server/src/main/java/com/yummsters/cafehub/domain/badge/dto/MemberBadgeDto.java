package com.yummsters.cafehub.domain.badge.dto;

import java.time.LocalDateTime;

import com.yummsters.cafehub.domain.badge.entity.Badge;
import com.yummsters.cafehub.domain.badge.entity.MemberBadges;

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

	   
	    public MemberBadges toEntity() {
	    	 
			 return MemberBadges.builder()
					    .memberBadgeNo(memberBadgeNo)
			            .memNo(memNo)
			            .badge(Badge.builder().badgeNo(badgeNo).badgeName(badgeName).build())
			            .regDate(regDate)
			            .build();
		}

}
