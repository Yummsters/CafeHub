package com.yummsters.cafehub.domain.file.service;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.review.entity.FileVo;
import org.springframework.web.multipart.MultipartFile;

import java.io.OutputStream;

public interface FileService {
    FileVo oneFileUpload(MultipartFile file, CafeAd cafeAd) throws Exception;
    void readThumbImg(Integer fileNum, OutputStream out) throws Exception;
    void readImage(Integer fileNum, OutputStream out) throws Exception;
}