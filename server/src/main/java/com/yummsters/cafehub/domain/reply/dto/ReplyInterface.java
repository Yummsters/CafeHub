package com.yummsters.cafehub.domain.reply.dto;

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
	LocalDateTime getRegDate();
	Integer getIsReplyLike();
}
