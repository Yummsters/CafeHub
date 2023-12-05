package com.yummsters.cafehub.domain.review.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WishReviewDTO {
    private Integer reviewNo;
    private String thumbImg;
    private Integer memNo; // 글쓴이
    private String nickname;  // Member의 nickname (writer)
    private String cafeName;
}
