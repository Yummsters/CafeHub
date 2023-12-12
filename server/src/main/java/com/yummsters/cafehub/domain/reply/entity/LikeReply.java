package com.yummsters.cafehub.domain.reply.entity;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.review.entity.Review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LikeReply {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer likeReplyNo;
	
	@ManyToOne
	@JoinColumn(name = "memNo")
    private Member member;
	
	@ManyToOne
	@JoinColumn(name = "replyNo")
    private Reply reply;
}
