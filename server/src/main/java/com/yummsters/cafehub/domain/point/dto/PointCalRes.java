package com.yummsters.cafehub.domain.point.dto;

import com.yummsters.cafehub.domain.point.entity.Point;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PointCalRes {
    // 포인트 정보
    private Integer pointCount;
    private LocalDateTime refDate;

    // 가게 정보
    private String cafeName;
    private String thumbImg;

    public static PointCalRes pointToPointCalRes(Point point){
        if(point == null){
            return null;
        }else {
            PointCalRes.PointCalResBuilder pointResponse = PointCalRes.builder();
            pointResponse.pointCount(point.getPointCount());
            pointResponse.refDate(point.getRefDate());
            pointResponse.cafeName(point.getMember().getCafe().getCafeName());
            pointResponse.thumbImg(point.getMember().getCafe().getThumbImg());
            return pointResponse.build();
        }
    }
}