package com.yummsters.cafehub.domain.reply.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yummsters.cafehub.domain.reply.entity.Reply;
import com.yummsters.cafehub.domain.reply.repository.ReplyRepository;

@Service
public class ReplyServiceImpl implements ReplyService {
		
	@Autowired
	private ReplyRepository replyRepository;

	@Override
	public void replyDelete(Integer replyNo) throws Exception {
		Reply reply = replyRepository.findByReplyNo(replyNo);
		if(reply != null) {
			throw new Exception("존재하지 않는 댓글입니다.");
		}
		replyRepository.delete(reply);
	}
}
