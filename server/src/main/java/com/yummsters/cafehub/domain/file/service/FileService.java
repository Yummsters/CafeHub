package com.yummsters.cafehub.domain.file.service;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.review.entity.FileVo;
import com.yummsters.cafehub.domain.review.repository.FileVoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.OutputStream;

public interface FileService {

    FileVo oneFileUpload(MultipartFile file, CafeAd cafeAd) throws Exception;
    void readThumbImg(Integer fileNum, OutputStream out) throws Exception;
}