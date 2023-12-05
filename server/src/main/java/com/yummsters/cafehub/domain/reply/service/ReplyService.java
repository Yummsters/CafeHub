package com.yummsters.cafehub.domain.reply.service;

public interface ReplyService {
	void replyWrite(Integer reviewNo, String content) throws Exception;
	void replyDelete(Integer replyNo) throws Exception;
	boolean toggleLikeReply(Integer memNo, Integer replyNo) throws Exception;
	Integer getLikeCount(Integer replyNo) throws Exception;
}
