package com.yummsters.cafehub.domain.review.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.review.dto.ReviewDetailDto;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.dto.ReviewModifyDto;
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
	Integer modifyReview(Integer reviewNo, ReviewModifyDto reviewModifyDto, List<MultipartFile> files) throws Exception; //리뷰 수정
	// 희진 part
	Page<Review> storeReviewPage(Integer page, Integer size, Integer cafeNo);
	Page<Review> userReviewPage(Integer page, Integer size, String nickname);
	void deleteReviewAuth() throws Exception;

	//혜리 part ----------------------------------------------------------------
	Page<Review> getReviewList(String search, Pageable pageable) throws Exception;
	Page<Review> getReviewsByMember(Member member, Pageable pageable) throws Exception;
}
