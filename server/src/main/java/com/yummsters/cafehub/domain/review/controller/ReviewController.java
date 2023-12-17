package com.yummsters.cafehub.domain.review.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.review.dto.ReviewAuthDto;
import com.yummsters.cafehub.domain.review.dto.ReviewDetailDto;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.dto.ReviewListRes;
import com.yummsters.cafehub.domain.review.dto.ReviewModifyDto;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.entity.ReviewAuth;
import com.yummsters.cafehub.domain.review.service.ReviewService;
import com.yummsters.cafehub.global.response.MultiResponseDto;

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
		@PostMapping("/reviewmodify/{reviewNo}")
	    public ResponseEntity<Integer> modifyReview(@PathVariable Integer reviewNo,
	                                                @ModelAttribute ReviewModifyDto review,
	                                                @RequestParam(value = "files", required = false) List<MultipartFile> files) {
	        try {
	            Integer updatedReviewNo = reviewService.modifyReview(reviewNo, review, files);
	            return ResponseEntity.ok(updatedReviewNo);
	        } catch (Exception e) {
	            e.printStackTrace();
	            return ResponseEntity.badRequest().build();
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
            @RequestParam(defaultValue = "5") int size, @RequestParam(defaultValue = "") String search) {
		try {
			Page<Review> reviewsPage = reviewService.getReviewList(search, PageRequest.of(page, size));
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
	
	@GetMapping("/userReview")
	public ResponseEntity<Page<Review>> getReviewsByMember(Principal principal, Pageable pageable) {
	    try {
	        // Assuming the member's username is the same as the nickname
	        Member member = new Member();
	        member.setNickname(principal.getName());

	        Page<Review> reviews = reviewService.getReviewsByMember(member, pageable);

	        return new ResponseEntity<>(reviews, HttpStatus.OK);
	    } catch (Exception e) {
	        e.printStackTrace();
	        // 예외가 발생한 경우 500 Internal Server Error 응답을 반환합니다.
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	//희진 part ----------------------------------------------------------------
	// 가게 리뷰 리스트 조회
	@GetMapping("/review/storeList/{cafeNo}")
	public ResponseEntity<Object> storeList(@RequestParam("page") Integer page, @RequestParam("size") Integer size,
								  @PathVariable("cafeNo") Integer cafeNo){
		try{
			Page<Review> reviewPage = reviewService.storeReviewPage(page-1, size, cafeNo);
			List<Review> responseList = reviewPage.getContent();
			List<ReviewListRes> responseLists = new ArrayList<>();

			for(Review review : responseList){
				responseLists.add(ReviewListRes.reviewToReviewListRes(review));
			}
			return new ResponseEntity<>(new MultiResponseDto<>(responseLists, reviewPage), HttpStatus.OK);
		}catch (Exception e){
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
		}
	}
}
