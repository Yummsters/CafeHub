package com.yummsters.cafehub.domain.review.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.review.dto.ReviewAuthDto;
import com.yummsters.cafehub.domain.review.dto.ReviewDetailDto;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.entity.ReviewAuth;
import com.yummsters.cafehub.domain.review.service.ReviewService;

@RestController
public class ReviewController {
	@Autowired
	private ReviewService reviewService;
	
	// 수빈 part ----------------------------------------------------------------------
	
	//리뷰 권한
	@GetMapping("/reviewauth/{memNo}")
	public ResponseEntity<List<ReviewAuthDto>> getReviewAuthByMemNo(@PathVariable Integer memNo) {
		  try {
		        List<ReviewAuth> reviewAuthList = reviewService.getReviewAuthList(memNo);
		        List<ReviewAuthDto> reviewAuthDtoList = reviewAuthList.stream()
		                .map(ReviewAuthDto::fromEntity)
		                .collect(Collectors.toList());
		        return new ResponseEntity<>(reviewAuthDtoList, HttpStatus.OK);
		    } catch (Exception e) {
		        e.printStackTrace();
		        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		    }
	}

	//리뷰 등록
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
	// 리뷰 삭제
	@DeleteMapping("/review/{reviewNo}/delete")
	public ResponseEntity<Integer> reviewDelete(@PathVariable Integer reviewNo) {
	    try {
	        reviewService.deleteReview(reviewNo);
	        return new ResponseEntity<>(reviewNo, HttpStatus.OK);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}
	//리뷰 수정
		@PutMapping("/reviewmodify/{revewNo}")
	    public ResponseEntity<Integer> modifyReview(@PathVariable Integer reviewNo,
	                                                @ModelAttribute ReviewDto review,
	                                                @RequestParam("files") List<MultipartFile> files) {
	        try {
	            Integer updatedReviewNo = reviewService.modifyReview(reviewNo, review, files);
	            return ResponseEntity.ok(updatedReviewNo);
	        } catch (Exception e) {
	            e.printStackTrace();
	            return ResponseEntity.badRequest().build();
	        }
	    }
		
		@GetMapping("/thumbImg/{thumbImg}")
		public void thumbImgView(@PathVariable String thumbImg, HttpServletResponse response) {
		    try {
		       
		        Integer fileNum = Integer.parseInt(thumbImg);
		        reviewService.readImage(fileNum, response.getOutputStream());
		    } catch (Exception e) {
		        e.printStackTrace();
		    }
		}


	// 선진 part ----------------------------------------------------------------------
	@GetMapping("/review/{reviewNo}")
	public ResponseEntity<Object> getReviewDetail(@PathVariable Integer reviewNo,
												@RequestHeader(required = false) Integer memNo) {
		try {
			Map<String, Object> res = new HashMap<>();
			ReviewDetailDto review = reviewService.reviewDetail(reviewNo);
			res.put("review", review);
			boolean isLike = reviewService.isLikeReview(memNo, reviewNo);
			res.put("isLike", isLike);
			boolean isWish = reviewService.isWishReview(memNo, reviewNo);
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
	public ResponseEntity<Page<Map<String, Object>>> getReviewList(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
		try {
			Page<Review> reviewsPage = reviewService.getReviewList(PageRequest.of(page, size));
	        Page<Map<String, Object>> res = reviewsPage.map(new Function<Review, Map<String, Object>>() {
	            @Override
	            public Map<String, Object> apply(Review review) {
	                Map<String, Object> reviewData = new HashMap<>();
	                reviewData.put("thumbImg", review.getThumbImg());
	                reviewData.put("title", review.getTitle());
	                reviewData.put("cafeName", review.getCafe().getCafeName());
	                reviewData.put("likeCount", review.getLikeCount());
	                reviewData.put("regDate", review.getRegDate());
	                reviewData.put("nickname", review.getMember().getNickname());
	                reviewData.put("reviewNo", review.getReviewNo());
	                return reviewData;
	            }
	        });
			return new ResponseEntity<>(res, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
}
