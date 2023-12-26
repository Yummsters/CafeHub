package com.yummsters.cafehub.domain.tag.entity;

import com.yummsters.cafehub.domain.review.entity.Review;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@DynamicInsert
@DynamicUpdate
public class ReviewToTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewToTagNo;
    @ManyToOne
    @JoinColumn(name = "reviewNo")
    private Review review;
    @ManyToOne
    @JoinColumn(name = "tagNo")
    private ReviewTag reviewTag;
}