package com.yummsters.cafehub.domain.reply.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

//import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yummsters.cafehub.domain.reply.dto.ReplyDto;
import com.yummsters.cafehub.domain.reply.dto.ReplyInterface;
import com.yummsters.cafehub.domain.reply.entity.Reply;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Integer> {
	Reply findByReplyNo(Integer replyNo);
	Page<ReplyDto> findAllByReview_ReviewNoOrderByReplyNoDesc(Integer reviewNo, Pageable pageable);
	Optional<ReplyDto> findTopByReview_ReviewNoOrderByLikeCountDesc(Integer reviewNo);
	
	@Query(value = "SELECT r.reply_no as replyNo, "
			+ "r.content, "
			+ "r.review_no as reviewNo, "
			+ "r.depth, "
			+ "r.writer as writerNo, "
			+ "m.nickname as writer, "
			+ "m.nickname, "
			+ "r.like_count as likeCount, "
			+ "r.reg_date as regDate, "
			+ "(SELECT COUNT(*)>0 FROM like_reply lr WHERE lr.mem_no=:memNo AND lr.reply_no=r.reply_no) AS isReplyLike "
			+ "FROM reply r "
			+ "JOIN member m ON m.mem_no = r.writer "
			+ "WHERE r.review_no=:reviewNo "
			+ "ORDER BY r.like_count DESC "
			+ "LIMIT 1", nativeQuery = true)
	Optional<ReplyInterface> findBestReply(@Param("memNo") Integer memNo,@Param("reviewNo") Integer reviewNo);
	

	@Query(value = "SELECT"
			+ "  r.reply_no as replyNo, "
			+ "  r.content, "
			+ "  r.review_no as reviewNo, "
			+ "  r.depth, "
			+ "  r.writer as writerNo, "
			+ "  m.nickname as writer, "
			+ "  m.nickname, "
			+ "  r.like_count as likeCount, "
			+ "  r.reg_date as regDate, "
			+ "  COUNT(lr.like_reply_no) > 0 as isReplyLike "
			+ "FROM reply r "
			+ "JOIN member m ON m.mem_no = r.writer "
			+ "LEFT JOIN like_reply lr ON lr.reply_no=r.reply_no and lr.mem_no=:memNo "
			+ "WHERE r.review_no=:reviewNo "
			+ "GROUP BY r.reply_no, m.mem_no "
			+ "ORDER BY IFNULL(parent_reply_no, r.reply_no) DESC, depth, r.reply_no"
			, nativeQuery = true)
	Page<ReplyInterface> findReplyList(@Param("memNo") Integer memNo,@Param("reviewNo") Integer reviewNo, Pageable pageable);
}
