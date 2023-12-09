package com.yummsters.cafehub.domain.review.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.yummsters.cafehub.domain.map.entity.Cafe;

import com.yummsters.cafehub.domain.review.dto.ReviewDetailDTO;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.service.ReviewService;

@RestController
public class ReviewController {
	@Autowired
	private ReviewService reviewService;
//	
//	@GetMapping("/reviewauth/{memNo}")
//	public ResponseEntity<Object> getReviewAuthList(@PathVariable Integer memNo) {
//	    try {
//	        List<ReviewAuth> reviewAuthList = reviewService.getReviewAuthList(memNo);
//	        return new ResponseEntity<Object>(reviewAuthList, HttpStatus.OK);
//	    } catch (Exception e) {
//	        e.printStackTrace();
//	        return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
//	    }
//	}
	@GetMapping("/reviewauth/{memNo}")
    public ResponseEntity<List<Cafe>> getCafesByMemNo(@PathVariable Integer memNo) {
        try {
        	
        	List<Cafe> cafes = reviewService.getReviewAuthList(memNo);
        	return new ResponseEntity<List<Cafe>>(cafes, HttpStatus.OK);
        }catch(Exception e) {
        	e.printStackTrace();
        	return new ResponseEntity<List<Cafe>>(HttpStatus.BAD_REQUEST);
        }
    }

	
	@PostMapping("/reviewwrite")
	public ResponseEntity<Integer> reviewWrite(@ModelAttribute ReviewDto review,
	                                          @RequestParam("file") List<MultipartFile> files) {
	    try {
	        Integer reviewNo = reviewService.reviewWrite(review, files);
	        return new ResponseEntity<>(reviewNo, HttpStatus.OK);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}


	// 선진 part ----------------------------------------------------------------------
	@GetMapping("/review/{reviewNo}")
	public ResponseEntity<Object> getReviewDetail(@PathVariable Integer reviewNo) {
		try {
			Map<String, Object> res = new HashMap<>();
			ReviewDetailDTO review = reviewService.reviewDetail(reviewNo);
			res.put("review", review);
			boolean isLike = reviewService.isLikeReview(2, reviewNo); // 수정 필요
			res.put("isLike", isLike);
			boolean isWish = reviewService.isWishReview(2, reviewNo); // 수정 필요
			res.put("isWish", isWish);
			return new ResponseEntity<>(res, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/like/{memNo}/{reviewNo}")
	public ResponseEntity<Object> isLikeReview(@PathVariable Integer memNo, @PathVariable Integer reviewNo) {
		try {
			Map<String,Object> res = new HashMap<>();
			boolean toggleLike = reviewService.toggleLikeReview(memNo, reviewNo);
			res.put("toggleLike", toggleLike);
			Integer likeCount = reviewService.reviewDetail(reviewNo).getLikeCount();
			res.put("likeCount", likeCount);
			return new ResponseEntity<>(res, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/wish/{memNo}/{reviewNo}")
	public ResponseEntity<Boolean> isWishReview(@PathVariable Integer memNo, @PathVariable Integer reviewNo) {
		try {
			Boolean toggleWish = reviewService.toggleWishReview(memNo, reviewNo);
			return new ResponseEntity<>(toggleWish, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	//혜리 part ----------------------------------------------------------------
	@GetMapping("/reviewList")
	public ResponseEntity<List<Map<String, Object>>> getReviewList() {
		List<Map<String, Object>> res = new ArrayList<>();
		List<Review> reviews;
		try {
			reviews = reviewService.getReviewList();
			for (int i = 0; i < reviews.size(); i++) {
				Review data = reviews.get(i);
				Map<String, Object> review = new HashMap<>();

				review.put("thumbImg", data.getThumbImg());
				review.put("title", data.getTitle());
				review.put("cafeName", data.getCafe().getCafeName());
				review.put("likeCount", data.getLikeCount());
//				review.put("member", data.getMember());
				review.put("regDate", data.getRegDate());
				review.put("nickname", data.getMember().getNickname());
				review.put("reviewNo", data.getReviewNo());
				
				res.add(review);
			}
			return new ResponseEntity<>(res, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
}
