package com.yummsters.cafehub.domain.tag.repository;

import com.yummsters.cafehub.domain.tag.entity.StoreTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreTagRepository extends JpaRepository<StoreTag, Integer> {
    boolean existsByStoreTagName(String storeTagName);
}