package com.yummsters.cafehub.domain.cafeAd.entity;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.review.entity.FileVo;
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
    @JoinColumn(name = "cafeNo")
    private Cafe cafe;

    @OneToOne
    @JoinColumn(name = "fileNum", referencedColumnName = "fileNum")
    private FileVo fileVo;

   /* public void addThumbImg(String thumbImg) {
        this.thumbImg = thumbImg;
    }*/

    public void addFile(FileVo fileVo) {
        this.fileVo = fileVo;
    }
}