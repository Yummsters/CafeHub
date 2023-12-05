package com.yummsters.cafehub.domain.map.dto;

import com.yummsters.cafehub.domain.map.entity.Cafe;
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
    private String lat;
    private String lng;
    private boolean isPaid;
    private Date paidDate;
    private boolean isExisting;
    private String cafeInfo;
}
