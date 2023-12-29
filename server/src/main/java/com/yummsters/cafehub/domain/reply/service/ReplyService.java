package com.yummsters.cafehub.domain.reply.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.yummsters.cafehub.domain.reply.dto.ReplyDto;
import com.yummsters.cafehub.domain.reply.dto.ReplyInterface;
import com.yummsters.cafehub.domain.reply.entity.Reply;

public interface ReplyService {
	void replyWrite(Integer memNo, Integer reviewNo, String content) throws Exception;
	void replyDelete(Integer replyNo) throws Exception;
	boolean toggleLikeReply(Integer memNo, Integer replyNo) throws Exception;
	Integer getLikeCount(Integer replyNo) throws Exception;
	void addReReply(Integer replyNo, ReplyDto replyDto) throws Exception;
	Page<ReplyInterface> getRepliesByReviewNo(Integer memNo, Integer reivewNo, Pageable pageable) throws Exception;
	ReplyInterface getBestReplyByReviewNo(Integer memNo, Integer reviewNo) throws Exception;
	Page<Reply> findMyReply(Integer page, Integer size, Integer memNo);
}
