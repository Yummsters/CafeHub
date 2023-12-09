package com.yummsters.cafehub.domain.userMyPage.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WishCafeDTO {
    private Integer cafeNo;
    private String thumbImg;
    private String cafeName;
}
