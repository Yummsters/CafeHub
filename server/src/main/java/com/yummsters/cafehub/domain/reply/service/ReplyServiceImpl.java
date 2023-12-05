package com.yummsters.cafehub.domain.reply.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yummsters.cafehub.domain.likeReply.entity.LikeReply;
import com.yummsters.cafehub.domain.likeReply.repository.LikeReplyRepository;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.reply.entity.Reply;
import com.yummsters.cafehub.domain.reply.repository.ReplyRepository;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.repository.ReviewRepository;

@Service
public class ReplyServiceImpl implements ReplyService {
		
	@Autowired
	private ReviewRepository reviewRepository;
	
	@Autowired
	private ReplyRepository replyRepository;
	
	@Autowired
	private MemberRepository memberRepository;
	
	@Autowired
	private LikeReplyRepository likeReplyRepository;
	
	@Override
	public void replyWrite(Integer reviewNo, String content) throws Exception {
		Review review = reviewRepository.findByReviewNo(reviewNo);
		if(review!=null) {			
			Reply newReply = Reply.builder()
					.content(content)
					.review(review)
					.build();
			replyRepository.save(newReply);
		} else {
			throw new Exception("존재하지 않는 리뷰입니다.");
		}
	}	

	@Override
	public void replyDelete(Integer replyNo) throws Exception {
		Reply reply = replyRepository.findByReplyNo(replyNo);
		if(reply != null) {
			throw new Exception("존재하지 않는 댓글입니다.");
		}
		replyRepository.delete(reply);
	}

	@Override
	public boolean toggleLikeReply(Integer memNo, Integer replyNo) throws Exception {
		Reply reply = replyRepository.findByReplyNo(replyNo);
		Member member = memberRepository.findByMemNo(memNo);
		boolean isLike = likeReplyRepository.existsByMember_memNoAndReply_replyNo(memNo, replyNo);
		if(isLike) {
			likeReplyRepository.deleteByMember_memNoAndReply_replyNo(memNo, replyNo);
			reply.decreaseLikeCount();
			replyRepository.save(reply);
			return false;
		} else {
			likeReplyRepository.save(LikeReply.builder().member(member).reply(reply).build());
			reply.increaseLikeCount();
			replyRepository.save(reply);
			return true;
		}
	}

	@Override
	public Integer getLikeCount(Integer replyNo) throws Exception {
		Reply reply = replyRepository.findByReplyNo(replyNo);
		if(reply!=null) {
			return reply.getLikeCount();
		} else {
			throw new Exception("존재하지 않는 댓글입니다.");
		}
	}
}
