package com.yummsters.cafehub.domain.cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CafeDto {
    private Integer cafeNo;
    private String cafeName;
    private String tel;
    private String businessNo;
    private String address;
    private String operTime;
    private String thumbImg;
    private String tagName;
    private String lat;
    private String lng;
    private boolean isPaid;
    private LocalDateTime paidDate;
    private boolean isExisting;
    private String cafeInfo;
}