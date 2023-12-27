package com.yummsters.cafehub.domain.review.controller;

import com.yummsters.cafehub.domain.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/common")
@RequiredArgsConstructor
public class FileUploadController {
    private final FileService fileService;

    @Value("${upload.path}")
    private String uploadPath;

    // 기본 URL 정의
    private static final String BASE_URL = "http://43.203.34.143:8080/common/";

    @PostMapping("/fileUpload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("images") MultipartFile file) {
        String imageUrl = generateImageUrl(file);
     
        return ResponseEntity.ok(imageUrl);
    }

    private String generateImageUrl(MultipartFile file) {
       
        String fileName = file.getOriginalFilename();
        try {
           
            file.transferTo(new File(uploadPath + fileName));
            
        } catch (IOException e) {
           
            e.printStackTrace();
            return "서버 이미지 업로드 실패";
        }
       
        return BASE_URL + fileName;
    }

//    @GetMapping("/{filename:.+}")
//    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws IOException {
//        // URL 디코딩
//        String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8.toString());
//        Resource fileResource = new FileSystemResource(uploadPath + decodedFilename);
//
//        return ResponseEntity.ok()
//                .body(fileResource);
//    }
//
//    @PostMapping("/cropAndUpload")
//    public ResponseEntity<String> handleCroppedImageUpload(@RequestParam("croppedImage") MultipartFile croppedImage) {
//        String imageUrl = generateImageUrl(croppedImage);
//        return ResponseEntity.ok(imageUrl);
//    }

    // 업로드 이미지 조회
    @GetMapping("/upload/{fileNum}")
    public void searchThumbImg(@PathVariable("fileNum") Integer fileNum, HttpServletResponse response){
        try {
            
            fileService.readThumbImg(fileNum, response.getOutputStream());
          
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
    
	@GetMapping("/thumbImg/{thumbImg}")
	public void thumbImgView(@PathVariable String thumbImg, HttpServletResponse response) {
	    try {
	       
	        Integer fileNum = Integer.parseInt(thumbImg);
	        fileService.readImage(fileNum, response.getOutputStream());
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
}