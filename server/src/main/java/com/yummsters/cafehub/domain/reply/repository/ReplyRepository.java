package com.yummsters.cafehub.domain.reply.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yummsters.cafehub.domain.reply.entity.Reply;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Integer> {
	Reply findByReplyNo(Integer replyNo);
}
