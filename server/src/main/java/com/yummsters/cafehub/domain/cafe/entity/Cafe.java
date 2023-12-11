package com.yummsters.cafehub.domain.cafe.entity;

import com.yummsters.cafehub.domain.cafe.dto.CafeDto;
import com.yummsters.cafehub.domain.member.entity.Member;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "member")
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
    private LocalDateTime paidDate;
    @Column
    private boolean isExisting;
    @Column
    private String cafeInfo;

    /*@OneToOne(mappedBy="cafe")
    private Member member;*/

    public CafeDto toDTO() {
        return CafeDto.builder()
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
