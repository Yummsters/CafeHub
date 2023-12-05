package com.yummsters.cafehub.domain.review.service;

import java.io.OutputStream;
import java.util.List;

import com.yummsters.cafehub.domain.review.dto.ReviewDetailDTO;
import com.yummsters.cafehub.domain.mypage.dto.WishReviewDTO;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.review.dto.ReviewDto;

public interface ReviewService {

    // 선진 part ----------------------------------------------------------------------
	ReviewDetailDTO reviewDetail(Integer reviewNo) throws Exception; // 리뷰 상세 조회
	boolean isLikeReview(Integer memNo, Integer reviewNo) throws Exception; // 회원의 리뷰 추천 여부
	boolean toggleLikeReview(Integer memNo, Integer reviewNo) throws Exception; // 추천, 추천취소
	boolean isWishReview(Integer memNo, Integer reviewNo) throws Exception; // 회원의 리뷰 찜 여부
	boolean toggleWishReview(Integer memNo, Integer reviewNo) throws Exception; // 찜, 찜 취소

	// 선진 part ----------------------------------------------------------------------

	Integer reviewWrite(ReviewDto review, List<MultipartFile> file) throws Exception;
	//썸네일 이미지
	void thumbImg(Integer reviewNo, OutputStream out) throws Exception;
	//카페리스트
//	ReviewDto cafeList(String writer) throws Exception;

}
