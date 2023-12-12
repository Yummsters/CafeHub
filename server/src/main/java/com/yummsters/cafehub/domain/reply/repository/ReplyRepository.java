package com.yummsters.cafehub.domain.reply.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

//import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yummsters.cafehub.domain.reply.entity.Reply;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Integer> {
	Reply findByReplyNo(Integer replyNo);
	Page<Reply> findAllByReview_ReviewNo(Integer reviewNo, Pageable pageable);
	Optional<Reply> findTopByReview_ReviewNoOrderByLikeCountDesc(Integer reviewNo);
}
