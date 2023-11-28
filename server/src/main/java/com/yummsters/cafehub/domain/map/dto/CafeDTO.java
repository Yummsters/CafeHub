package com.yummsters.cafehub.domain.map.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CafeDTO {
    private Integer cafeNo;
    private String cafeName;
    private String tel;
    private String businessNo;
    private String address;
    private String operTime;
    private String thumbImg;
    private String tagName;
    private Long lat;
    private Long lng;
    private boolean isPaid;
    private Date paidDate;
    private boolean isExisting;
}
