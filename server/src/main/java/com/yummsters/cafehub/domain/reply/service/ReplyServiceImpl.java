package com.yummsters.cafehub.domain.reply.service;

import org.springframework.stereotype.Service;

import com.yummsters.cafehub.domain.reply.repository.ReplyRepository;

@Service
public class ReplyServiceImpl implements ReplyService {
		
//	private final ReplyRepository replyRepository;

	@Override
	public void replyDelete(Integer replyNo) throws Exception {
		
	}

//	@Override
//	public void replyDelete(Integer replyNo) throws Exception {
//		replyRepository.findByReplyByNo(replyNo).isPresent()
//	}

}
