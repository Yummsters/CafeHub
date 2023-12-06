package com.yummsters.cafehub.domain.usermypage.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WishReviewDTO {
    private Integer reviewNo;
    private String thumbImg;
    private Integer memNo;
    private String nickname;
    private String cafeName;
}
