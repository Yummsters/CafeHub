package com.yummsters.cafehub.domain.reply.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yummsters.cafehub.domain.reply.entity.LikeReply;
import com.yummsters.cafehub.domain.reply.entity.Reply;
import com.yummsters.cafehub.domain.review.entity.LikeReview;
import com.yummsters.cafehub.domain.review.entity.Review;

@Repository
public interface LikeReplyRepository extends JpaRepository<LikeReply, Integer> {
	boolean existsByMember_memNoAndReply_replyNo(Integer memNo, Integer replyNo);
	
	@Transactional
	void deleteByMember_memNoAndReply_replyNo(Integer memNo, Integer replyNo);
	List<LikeReply> findByReply(Reply reply); 
	List<LikeReply> findByReply_ReplyNo(Integer replyNo);
}
