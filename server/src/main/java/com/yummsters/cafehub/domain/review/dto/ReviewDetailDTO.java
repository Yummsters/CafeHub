package com.yummsters.cafehub.domain.review.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDetailDTO {
    private Integer reviewNo;
    private String title;
    private String content;
    private List<String> tagNames;
    private Integer likeCount;
    private LocalDateTime regDate;

    // Member 정보
    private Integer memNo;
    private String nickname;  // Member의 nickname (writer)

    // Cafe 정보
    private Integer cafeNo;
    private String cafeName;  // Cafe의 이름
    private String lat;
    private String lng;
}