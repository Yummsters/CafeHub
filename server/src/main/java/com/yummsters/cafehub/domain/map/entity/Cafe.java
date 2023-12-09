package com.yummsters.cafehub.domain.map.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.yummsters.cafehub.domain.map.dto.CafeDTO;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.review.entity.Review;
import lombok.*;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "reviews")
public class Cafe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cafeNo;
    @Column
    private String cafeName;
    @Column
    private String tel;
    @Column
    private String businessNo;
    @Column
    private String address;
    @Column
    private String operTime;
    @Column
    private String thumbImg;
    @Column
    private String tagName;
    @Column
    private String lat;
    @Column
    private String lng;
    @Column
    private boolean isPaid;
    @Column
    private Date paidDate;
    @Column
    private boolean isExisting;
    @Column
    private String cafeInfo;

    @OneToMany(mappedBy = "cafe") @JsonIgnore

    public CafeDTO toDTO() {
        return CafeDTO.builder()
                .cafeNo(cafeNo)
                .cafeName(cafeName)
                .tel(tel)
                .businessNo(businessNo)
                .address(address)
                .operTime(operTime)
                .thumbImg(thumbImg)
                .tagName(tagName)
                .lat(lat)
                .lng(lng)
                .isPaid(isPaid)
                .paidDate(paidDate)
                .isExisting(isExisting)
                .build();
    }
}