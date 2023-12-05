package com.yummsters.cafehub.domain.mypage.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WishReviewDTO {
    private Integer reviewNo;
    private String thumbImg;
    private String nickname;
    private String cafeName;
}
