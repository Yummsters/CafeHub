package com.yummsters.cafehub.domain.review.service;

import java.io.OutputStream;

import com.yummsters.cafehub.domain.review.dto.ReviewDto;

public interface ReviewService {
	ReviewDto reviewDetail(Integer reviewNo) throws Exception;
	//썸네일 이미지
	void thumbImg(Integer reviewNo, OutputStream out) throws Exception;
	//리뷰 삭제
}
