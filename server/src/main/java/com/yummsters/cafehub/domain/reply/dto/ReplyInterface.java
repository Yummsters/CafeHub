package com.yummsters.cafehub.domain.reply.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public interface ReplyInterface {
	Integer getReplyNo();
	String getContent();
	Integer getReviewNo();
	Integer getDepth();
	Integer getWriterNo();
	String getWriter();
	String getNickname();
	Integer getLikeCount();
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	LocalDateTime getRegDate();
	Integer getIsReplyLike();
}
