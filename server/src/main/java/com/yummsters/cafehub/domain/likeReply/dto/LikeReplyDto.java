package com.yummsters.cafehub.domain.likeReply.dto;

import com.yummsters.cafehub.domain.likeReply.entity.LikeReply;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.reply.entity.Reply;

public class LikeReplyDto {
	
	private Integer likeReplyNo;
	private Integer memNo;
	private Integer replyNo;
	
	public LikeReply toEntity() {
		return LikeReply.builder()
				.member(Member.builder().memNo(memNo).build())
				.reply(Reply.builder().replyNo(replyNo).build())
				.build();
	}
}
