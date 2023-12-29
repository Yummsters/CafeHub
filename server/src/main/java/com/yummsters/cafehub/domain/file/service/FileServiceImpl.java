package com.yummsters.cafehub.domain.file.service;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.review.entity.FileVo;
import com.yummsters.cafehub.domain.review.repository.FileVoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService{
    @Value("${upload.path}")
    private String uploadPath;

    private final FileVoRepository fileVoRepository;

    @Override
    @Transactional
    public FileVo oneFileUpload(MultipartFile file, CafeAd cafeAd) throws Exception {
        String dir = uploadPath;
        FileVo fileVo = FileVo.builder()
                .directory(dir)
                .name(file.getOriginalFilename())
                .size(file.getSize())
                .contenttype(file.getContentType())
                .data(file.getBytes())
                .build();

        fileVoRepository.save(fileVo);

        File uploadFile = new File(dir + fileVo.getFileNum());
        file.transferTo(uploadFile);

        return fileVoRepository.findByFileNum(fileVo.getFileNum());
    }

    @Override
    public void readThumbImg(Integer fileNum, OutputStream out) throws Exception {
        String dir = uploadPath;
        FileInputStream fis = new FileInputStream(dir+fileNum);
        System.out.println(dir + fileNum);
        FileCopyUtils.copy(fis, out);
        fis.close();
    }
    @Override
	public void readImage(Integer fileNum, OutputStream out) throws Exception {
        String dir = uploadPath;
        FileInputStream fis = new FileInputStream(new File(dir + fileNum));
        FileCopyUtils.copy(fis, out);
        fis.close();
    }
}