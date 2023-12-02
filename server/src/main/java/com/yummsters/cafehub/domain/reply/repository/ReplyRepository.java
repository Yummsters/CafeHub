package com.yummsters.cafehub.domain.reply.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.reply.entity.Reply;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {
	Optional<Reply> findByReplyByNo(Integer replyNo);
}
