package com.yummsters.cafehub.domain.mypage.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WishStoreDTO {
    private Integer cafeNo;
    private String thumbImg;
    private String cafeName;
}
