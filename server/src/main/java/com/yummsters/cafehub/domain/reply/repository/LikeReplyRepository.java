package com.yummsters.cafehub.domain.reply.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yummsters.cafehub.domain.reply.entity.LikeReply;
import com.yummsters.cafehub.domain.reply.entity.Reply;

@Repository
public interface LikeReplyRepository extends JpaRepository<LikeReply, Integer> {
	boolean existsByMember_memNoAndReply_replyNo(Integer memNo, Integer replyNo);
	@Transactional
	void deleteByMember_memNoAndReply_replyNo(Integer memNo, Integer replyNo);
}
