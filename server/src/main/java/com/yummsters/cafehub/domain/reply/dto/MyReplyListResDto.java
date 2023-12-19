package com.yummsters.cafehub.domain.reply.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.yummsters.cafehub.domain.reply.entity.Reply;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MyReplyListResDto {
    // 댓글 정보
    private Integer replyNo;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime regDate;

    // 리뷰 정보
    private Integer reviewNo;
    private String title;

    public static MyReplyListResDto replyToMyReplyListRes(Reply reply){
        if(reply == null){
            return null;
        }else {
            MyReplyListResDto.MyReplyListResDtoBuilder reviewListRes = MyReplyListResDto.builder();
            reviewListRes.replyNo(reply.getReplyNo());
            reviewListRes.content(reply.getContent());
            reviewListRes.regDate(reply.getRegDate());
            reviewListRes.reviewNo(reply.getReview().getReviewNo());
            reviewListRes.title(reply.getReview().getTitle());
            return reviewListRes.build();
        }
    }
}