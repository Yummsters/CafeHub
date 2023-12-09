package com.yummsters.cafehub.domain.review.service;


import java.io.File;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.map.repository.CafeRepository;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.review.dto.ReviewDetailDTO;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.entity.FileVo;
import com.yummsters.cafehub.domain.review.entity.LikeReview;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.entity.ReviewAuth;
import com.yummsters.cafehub.domain.review.entity.WishReview;
import com.yummsters.cafehub.domain.review.repository.FileVoRepository;
import com.yummsters.cafehub.domain.review.repository.LikeReviewRepository;
import com.yummsters.cafehub.domain.review.repository.ReviewAuthRepository;
import com.yummsters.cafehub.domain.review.repository.ReviewDetailRepository;
import com.yummsters.cafehub.domain.review.repository.ReviewRepository;
import com.yummsters.cafehub.domain.review.repository.WishReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
	private final ReviewRepository reviewRepository;
	private final FileVoRepository fileVoRepository;
	private final ReviewDetailRepository detailRepository;
	private final MemberRepository memberRepository;
	private final LikeReviewRepository likeRepository;
	private final WishReviewRepository wishRepository;
	private final ReviewAuthRepository reviewAuthRepository;
	private final CafeRepository cafeRepository;

	//리뷰작성
	@Override
	public Integer reviewWrite(ReviewDto review, List<MultipartFile> files) throws Exception {
		
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
  
      // 선진 part ----------------------------------------------------------------------
	  @Override
	  public ReviewDetailDTO reviewDetail(Integer reviewNo) throws Exception {
		  return detailRepository.findReviewByReviewNo(reviewNo);
	  }

	@Override
	public boolean isLikeReview(Integer memNo, Integer reviewNo) throws Exception {
		return likeRepository.existsByMember_memNoAndReview_reviewNo(memNo, reviewNo);
	}

	@Override
	@Transactional
	public boolean toggleLikeReview(Integer memNo, Integer reviewNo) throws Exception {
		Review review = reviewRepository.findByReviewNo(reviewNo);
		Member member = memberRepository.findByMemNo(memNo);
		boolean isLike = likeRepository.existsByMember_memNoAndReview_reviewNo(memNo, reviewNo);
		if(isLike) {
			likeRepository.deleteByMember_memNoAndReview_reviewNo(memNo, reviewNo);
			review.setLikeCount(review.getLikeCount() - 1); // 추천 수 증가
			return false; // 추천 취소
		} else {
			likeRepository.save(LikeReview.builder().member(member).review(review).build());
			review.setLikeCount(review.getLikeCount() + 1); // 추천 수 증가
			return true; // 추천
		}
	}

	@Override
	public boolean isWishReview(Integer memNo, Integer reviewNo) throws Exception {
		return wishRepository.existsByMember_memNoAndReview_reviewNo(memNo, reviewNo);
	}

	@Override
	@Transactional
	public boolean toggleWishReview(Integer memNo, Integer reviewNo) throws Exception {
		Review review = reviewRepository.findByReviewNo(reviewNo);
		Member member = memberRepository.findByMemNo(memNo);
		boolean isWish = wishRepository.existsByMember_memNoAndReview_reviewNo(memNo, reviewNo);
		if(isWish) {
			wishRepository.deleteByMember_memNoAndReview_reviewNo(memNo, reviewNo);
			return false;
		} else {
			wishRepository.save(WishReview.builder().member(member).review(review).build());
			return true;
		}
	}

	// 희진 part ----------------------------------------------------------------------
	// 리뷰 권한 부여
	@Override
	public void reviewAuthPermmit(Integer memNo, Integer cafeNo) throws Exception {
		ReviewAuth reviewAuth = ReviewAuth.builder()
				.member(memberRepository.findByMemNo(memNo))
				.cafe(cafeRepository.findByCafeNo(cafeNo))
				.build();
		reviewAuthRepository.save(reviewAuth);
	}

	//혜리 part ----------------------------------------------------------------
	@Override
	public List<Review> getReviewList() throws Exception {
		return reviewRepository.findAllByOrderByReviewNoDesc();
	}
}
