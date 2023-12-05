package com.yummsters.cafehub.domain.reply.dto;

import java.time.LocalDateTime;

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
	private Review review;
	private Integer depth;
	private Integer writerNo;
	private String writer;
	private String nickname;
	private Integer likeCount;
	private LocalDateTime regDate;

	public Reply toEntity() {
		return Reply.builder()
				.content(content)
				.review(review)
				.depth(depth)
				.member(Member.noBuilder().memNo(writerNo).nickname(nickname).build())
				.likeCount(likeCount)
				.build();
	}
}
