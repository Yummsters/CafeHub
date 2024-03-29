package com.yummsters.cafehub.domain.userMyPage.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WishReviewDto {
    private Integer reviewNo;
    private String thumbImg;
    private Integer memNo;
    private String nickname;
    private String cafeName;
}
