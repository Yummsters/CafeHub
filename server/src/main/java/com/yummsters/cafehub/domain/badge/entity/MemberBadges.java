package com.yummsters.cafehub.domain.badge.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.yummsters.cafehub.domain.badge.dto.MemberBadgeDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberBadges {
	   @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer memberBadgeNo;
	   
	   @JoinColumn(name="memNo")
	    private Integer memNo;
	   
	    @ManyToOne
	    @JoinColumn(name="badgeNo")
	    private Badge badge;
	    
	    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	    private LocalDateTime regDate;
	    
	    
	    public Integer getBadgeNo() {
	        return badge.getBadgeNo();
	    }
	   
	    
	    public MemberBadgeDto toDTO() {
	        return MemberBadgeDto.builder()
	                .memberBadgeNo(memberBadgeNo)
	                .memNo(memNo)
	                .badgeNo(badge.getBadgeNo())
	                .badgeName(badge.getBadgeName())
	                .regDate(regDate)
	                .build();
	    }
	    
	    @Override
	    public String toString() {
	        return "MemberBadges{" +
	                "memberBadgeNo=" + memberBadgeNo +
	                ", memNo=" + memNo +
	                ", badge=" + badge.toString() + 
	                ", regDate=" + regDate +
	                '}';
	    }

}
