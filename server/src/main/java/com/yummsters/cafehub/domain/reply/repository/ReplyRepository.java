package com.yummsters.cafehub.domain.reply.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.reply.entity.Reply;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {

}
