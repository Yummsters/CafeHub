package com.yummsters.cafehub.domain.review.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/common")
public class FileUploadController {

    // 기본 URL 정의
    private static final String BASE_URL = "http://localhost:8080/";

    @PostMapping("/fileUpload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("images") MultipartFile file) {
       
        String imageUrl = generateImageUrl(file);

        // 클라이언트에게 URL 반환
        return ResponseEntity.ok(imageUrl);
    }

    private String generateImageUrl(MultipartFile file) {
        // 이미지 URL을 생성하는 로직
        String uploadDirectory = "c:/soobin/upload/";
        // 업로드된 파일의 원본 이름 획득
        String fileName = file.getOriginalFilename();

        try {
            // 파일을 지정된 디렉토리에 저장
            file.transferTo(new File(uploadDirectory + fileName));
        } catch (IOException e) {
            // 예외가 발생한 경우 적절히 처리
            e.printStackTrace();
            return "image_upload_fail";
        }

        // 클라이언트에게 URL 반환
        return BASE_URL + fileName;
    }
}
