package com.yummsters.cafehub.domain.reply.service;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.reply.dto.ReplyDto;
import com.yummsters.cafehub.domain.reply.dto.ReplyInterface;
import com.yummsters.cafehub.domain.reply.entity.LikeReply;
import com.yummsters.cafehub.domain.reply.entity.Reply;
import com.yummsters.cafehub.domain.reply.repository.LikeReplyRepository;
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
	public void replyWrite(Integer memNo, Integer reviewNo, String content) throws Exception {
		Member member = memberRepository.findByMemNo(memNo);
		Review review = reviewRepository.findByReviewNo(reviewNo);
		if (member != null && review != null) {
			Reply newReply = Reply.builder().depth(0).member(member).content(content).review(review).build();
			replyRepository.save(newReply);
		} else {
			throw new Exception("존재하지 않는 리뷰입니다.");
		}
	}

	@Override
	public void replyDelete(Integer replyNo) {
	    Optional<Reply> optionalReply = replyRepository.findById(replyNo);
	    if (optionalReply.isPresent()) {
	        Reply reply = optionalReply.get();
	        List<Reply> childReplies = replyRepository.findByParentReply_ReplyNo(replyNo);
	        
	        if (childReplies.isEmpty()) {
	            replyRepository.delete(reply);
	        } else {
	            reply.setContent("삭제된 댓글입니다.");
	            replyRepository.save(reply);
	        }
	    } else {
	        throw new IllegalArgumentException("해당 댓글이 없습니다. replyNo=" + replyNo);
	    }
	}


	@Override
	public boolean toggleLikeReply(Integer memNo, Integer replyNo) throws Exception {
		Reply reply = replyRepository.findByReplyNo(replyNo);
		Member member = memberRepository.findByMemNo(memNo);
		boolean isLike = likeReplyRepository.existsByMember_memNoAndReply_replyNo(memNo, replyNo);
		if (isLike) {
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
		if (reply != null) {
			return reply.getLikeCount();
		} else {
			throw new Exception("존재하지 않는 댓글입니다.");
		}
	}

	@Override
	@Transactional
	public void addReReply(Integer replyNo, ReplyDto replyDto) {
	    Reply parentReply = replyRepository.findByReplyNo(replyDto.getParentReplyNo());
	    if (parentReply != null) {
	        Review review = parentReply.getReview();
	        Member member = memberRepository.findByMemNo(replyDto.getWriterNo());

	        // Ensure that member is not null before creating the reReply
	        if (member != null) {
	            Reply reReply = Reply.builder()
	                .content(replyDto.getContent())
	                .review(review)
	                .depth(parentReply.getDepth() + 1)
	                .parentReply(parentReply)
	                .member(member)
	                .likeCount(replyDto.getLikeCount())
	                .build();

	            replyRepository.save(reReply);
	        } else {
	            throw new IllegalArgumentException("작성자를 찾을 수 없습니다.");
	        }
	    } else {
	        throw new IllegalArgumentException("원댓글을 찾을 수 없습니다.");
	    }
	}
	
	@Override
	public Page<ReplyInterface> getRepliesByReviewNo(Integer memNo, Integer reviewNo, Pageable pageable) throws Exception {
		try {
			Page<ReplyInterface> replyPage = replyRepository.findReplyList(memNo, reviewNo, pageable);
			System.out.println(replyPage.getContent());
			
			return replyPage;

//			return replyPage.map((reply) -> reply.toDto());
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("댓글 목록을 가져오는 중에 오류가 발생했습니다.");
		}
	}

	@Override
    public ReplyInterface getBestReplyByReviewNo(Integer memNo, Integer reviewNo) throws Exception {
        try {
            Optional<ReplyInterface> bestReply = replyRepository.findBestReply(memNo, reviewNo);
            if(bestReply.isPresent()) {
            	return bestReply.get();            	
            } else {
            	return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("베스트 댓글을 가져오는 중에 오류가 발생했습니다.");
        }
    }

	// 회원 댓글 조회
	@Override
	public Page<Reply> findMyReply(Integer page, Integer size, Integer memNo) {
		return replyRepository.findByMember_MemNo(PageRequest.of(page, size, Sort.by("regDate").descending()), memNo);
	}
}
