package com.yummsters.cafehub.domain.reply.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.reply.dto.ReplyDto;
import com.yummsters.cafehub.domain.review.entity.Review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer replyNo;

    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewNo", nullable = false)
    private Review review;
    
    @Column(nullable = false)
    private Integer depth;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parentReplyNo", nullable = true)
    private Reply parentReply;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer", nullable = false)
    private Member member;
    
    @Column
    private int likeCount;
    
    @CreatedDate
    private LocalDateTime regDate;
 
    public void decreaseLikeCount() {
    	this.likeCount--;
    }
    
    public void increaseLikeCount() {
    	this.likeCount++;
    }
    
    public void setContent(String content) {
    	this.content = content;
    }
    
    public ReplyDto toDto() {
        return ReplyDto.builder()
                .replyNo(this.replyNo)
                .content(this.content)
                .reviewNo(this.review.getReviewNo())
                .depth(this.depth)
                .parentReplyNo(this.parentReply != null ? this.parentReply.getReplyNo() : null)
                .writerNo(this.member.getMemNo())
                .writer(this.member.getNickname())
                .nickname(this.member.getNickname())
                .likeCount(this.likeCount)
                .regDate(this.regDate)
                .build();
    }
}
