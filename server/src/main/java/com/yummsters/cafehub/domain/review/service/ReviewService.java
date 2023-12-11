package com.yummsters.cafehub.domain.review.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.review.dto.ReviewDetailDto;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.entity.ReviewAuth;


public interface ReviewService {

    // 선진 part ----------------------------------------------------------------------
	ReviewDetailDto reviewDetail(Integer reviewNo) throws Exception; // 리뷰 상세 조회
	boolean isLikeReview(Integer memNo, Integer reviewNo) throws Exception; // 회원의 리뷰 추천 여부
	boolean toggleLikeReview(Integer memNo, Integer reviewNo) throws Exception; // 추천, 추천취소
	boolean isWishReview(Integer memNo, Integer reviewNo) throws Exception; // 회원의 리뷰 찜 여부
	boolean toggleWishReview(Integer memNo, Integer reviewNo) throws Exception; // 찜, 찜 취소


	// 수빈 part ----------------------------------------------------------------------
	Integer reviewWrite(ReviewDto review, List<MultipartFile> file) throws Exception; //리뷰 등록
	List<ReviewAuth> getReviewAuthList(Integer memNo) throws Exception; //리뷰 권한
	void deleteReviewAuth(Integer reviewAuthNo) throws Exception; //리뷰 권한 삭제
	void deleteReview(Integer reviewNo) throws Exception; //리뷰 삭제
	 
	// 희진 part
	// 리뷰 권한
	void reviewAuthPermmit(Integer memNo, Integer cafeNo) throws Exception;
	//혜리 part ----------------------------------------------------------------
	public Page<Review> getReviewList(Pageable pageable) throws Exception;
}
