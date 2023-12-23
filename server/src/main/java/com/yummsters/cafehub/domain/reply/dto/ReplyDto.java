package com.yummsters.cafehub.domain.reply.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.reply.entity.Reply;
import com.yummsters.cafehub.domain.review.entity.Review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReplyDto {

	private Integer replyNo;
	private String content;
	private Integer reviewNo;
	private Integer depth;
	private Integer writerNo;
	private String writer;
	private String nickname;
	private Integer likeCount;
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime regDate;
	private Integer parentReplyNo;

	public Reply toEntity() {
		return Reply.builder()
				.replyNo(replyNo)
				.content(content)
				.review(Review.builder().reviewNo(reviewNo).build())
				.depth(depth)
				.parentReply(Reply.builder().replyNo(parentReplyNo).build())
				.member(Member.builder().memNo(writerNo).nickname(nickname).build())
				.likeCount(likeCount)
				.build();
	}
}
