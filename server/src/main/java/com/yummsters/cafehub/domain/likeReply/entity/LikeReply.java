package com.yummsters.cafehub.domain.likeReply.entity;

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
import com.yummsters.cafehub.domain.reply.entity.Reply;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@ToString
public class LikeReply {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer likeReplyNo;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "memNo", nullable = false)
    private Member member;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "replyNo", nullable = false)
    private Reply reply;
	
	@Builder
	public LikeReply(Member member, Reply reply) {
		this.member = member;
		this.reply = reply;
	}
}
