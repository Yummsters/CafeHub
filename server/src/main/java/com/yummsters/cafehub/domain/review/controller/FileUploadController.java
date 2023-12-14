package com.yummsters.cafehub.domain.review.controller;

import com.yummsters.cafehub.domain.file.service.FileService;
import lombok.RequiredArgsConstructor;
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

    // 기본 URL 정의
    private static final String BASE_URL = "http://localhost:8080/common/";
    private static final String UPLOAD_DIRECTORY = "c:/soobin/uploads/"; // 수빈 업로드 경로
    //private static final String UPLOAD_DIRECTORY = "/Users/gmlwls/Desktop/kosta/upload/"; // 희진 업로드 경로

    @PostMapping("/fileUpload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("images") MultipartFile file) {
        String imageUrl = generateImageUrl(file);
        // 클라이언트에게 URL 반환
        return ResponseEntity.ok(imageUrl);
    }

    private String generateImageUrl(MultipartFile file) {
        // 이미지 URL을 생성하는 로직
        String fileName = file.getOriginalFilename();
        try {
            // 파일을 지정된 디렉토리에 저장
            file.transferTo(new File(UPLOAD_DIRECTORY + fileName));
            System.out.println("서버 이미지 업로드 성공 " + fileName);
        } catch (IOException e) {
            // 예외가 발생한 경우 적절히 처리
            e.printStackTrace();
            return "서버 이미지 업로드 실패";
        }
        // 클라이언트에게 URL 반환
        return BASE_URL + fileName;
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws IOException {
        // URL 디코딩
        String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8.toString());
        // 파일을 읽어올 Resource 생성
        Resource fileResource = new FileSystemResource(UPLOAD_DIRECTORY + decodedFilename);

        return ResponseEntity.ok()
                .body(fileResource);
    }

    @PostMapping("/cropAndUpload")
    public ResponseEntity<String> handleCroppedImageUpload(@RequestParam("croppedImage") MultipartFile croppedImage) {
        String imageUrl = generateImageUrl(croppedImage);
        return ResponseEntity.ok(imageUrl);
    }

    // 업로드 이미지 조회
    @GetMapping("/upload/{fileNum}")
    public void searchThumbImg(@PathVariable("fileNum") Integer fileNum, HttpServletResponse response){
        try {
            System.out.println("파일 출력");
            fileService.readThumbImg(fileNum, response.getOutputStream());
            System.out.println(response.getOutputStream());
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
