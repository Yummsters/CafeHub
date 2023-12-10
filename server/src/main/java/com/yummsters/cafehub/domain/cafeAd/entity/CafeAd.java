package com.yummsters.cafehub.domain.cafeAd.entity;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class CafeAd {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cafeAdNo;

    @Column(nullable = false)
    private String thumbImg;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String menu;

    @Column
    private boolean isPaid;

    @Column
    private boolean isApproved;

    @Column
    private LocalDateTime authDate;

    @OneToOne
    @JoinColumn(name="cafeNo")
    private Cafe cafe;
}