package com.yummsters.cafehub.domain.tag.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class StoreTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer storeTagNo;

    @Column
    private String storeTagName;
}