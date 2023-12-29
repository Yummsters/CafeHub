package com.yummsters.cafehub.domain.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.review.entity.FileVo;

public interface FileVoRepository extends JpaRepository<FileVo, Integer> {
    FileVo findByFileNum(Integer fileNum);
}
