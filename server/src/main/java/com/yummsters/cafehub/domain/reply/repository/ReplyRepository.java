package com.yummsters.cafehub.domain.reply.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

//import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yummsters.cafehub.domain.reply.entity.Reply;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Integer> {
	Reply findByReplyNo(Integer replyNo);
	Page<Reply> findAllByReview_ReviewNoOrderByReplyNoDesc(Integer reviewNo, Pageable pageable);
	Optional<Reply> findTopByReview_ReviewNoOrderByLikeCountDesc(Integer reviewNo);
	
	@Query("select r, (select count(*)>0 from likeReply lr where lr.memNo=:memNo and lr.replyNo=r.replyNo) as isReplyLike"
			+ " from reply r where :reviewNo=r.reviewNo order by likeCount desc limit 1")
	Reply findBestReply(@Param("memNo") Integer memNo,@Param("reviewNo") Integer reviewNo);
	
	@Query("select r, (select count(*)>0 from likeReply lr where lr.memNo=:memNo and lr.replyNo=r.replyNo) as isReplyLike"
			+ " from reply r where :reviewNo=r.reviewNo order by replyNo desc")
	Page<Reply> findReplyList(@Param("memNo") Integer memNo,@Param("reviewNo") Integer reviewNo);
}
