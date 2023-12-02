package com.yummsters.cafehub.domain.review.service;

import java.io.Console;
import java.io.File;
import java.io.OutputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.entity.FileVo;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.repository.FileVoRepository;
import com.yummsters.cafehub.domain.review.repository.ReviewRepository;

@Service
public class ReviewServiceImpl implements ReviewService {
	@Autowired
	private ReviewRepository reviewRepository;
	@Autowired
	private FileVoRepository fileVoRepository;
	
	//리뷰작성
	@Override
	public Integer reviewWrite(ReviewDto review, List<MultipartFile> files) throws Exception {
		System.out.println("33333");

		if (files != null && files.size()!= 0) {
			String dir = "c:/soobin/upload/";
			String fileNums = "";
			
			for (MultipartFile file : files) {
				
				FileVo fileVo = FileVo.builder()
						.directory(dir)
						.name(file.getOriginalFilename())
						.size(file.getSize())
						.contenttype(file.getContentType())
						.data(file.getBytes())
						.build();
				
				fileVoRepository.save(fileVo);

//	            // upload 폴더에 있는 이미지를 가져와서 썸네일 이미지 생성
	            String originalFilePath = dir + fileVo.getName();

//	            // 리뷰에 썸네일 이미지를 직접 추가
//				// upload 폴더에 upload
				File uploadFile = new File(dir + fileVo.getFileNum());
				System.out.println("File Path: " + uploadFile.getAbsolutePath());

				file.transferTo(uploadFile);

				// file번호 목록 만들기
				if (!fileNums.equals(""))
					fileNums += ",";
				fileNums += fileVo.getFileNum();
				System.out.println("11111"+fileNums);
				System.out.println("22222"+fileVo.getFileNum());
				
			}
			// 파일 번호 목록을 썸네일 이미지로 사용
			review.setThumbImg(fileNums);
			

		}
		
		// table에 insert
		Review reviewEntity = review.toEntity();
		reviewRepository.save(reviewEntity);
		return reviewEntity.getReviewNo();
	}
	
	

	@Override
	public ReviewDto reviewDetail(Integer reviewNo) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public void thumbImg(Integer reviewNo, OutputStream out) throws Exception {
//		 Optional<Review> optionalReview = reviewRepository.findById(reviewNo);
////		    
//		    if (optionalReview.isPresent()) {
//		        Review review = optionalReview.get();
//		        
//		        // DB에서 썸네일을 읽어옴
//		        byte[] thumbImgBytes = review.getThumbImg();
//		        
//		        // 읽어온 썸네일을 출력
//		        out.write(thumbImgBytes);
//		    } else {
//		        // 해당 리뷰 번호로 저장된 썸네일이 없는 경우 예외 처리
//		        throw new FileNotFoundException("Thumbnail not found for reviewNo: " + reviewNo);
//		    }
		
	}

	
//	@Override
//	public ReviewDto cafeList(String writer) throws Exception {
//		Optional<Review> cafel = reviewRepository.findById(writer);
//		if(cafel.isEmpty())
//			throw new Exception("작성할 리뷰가 없습니다.");
//		ReviewDto reviewDto = modelMapper.map(cafel.get(), ReviewDto.class);
//		return reviewDto;
//	}
	

	

}
