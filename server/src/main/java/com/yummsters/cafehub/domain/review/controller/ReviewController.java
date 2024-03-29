package com.yummsters.cafehub.domain.review.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.yummsters.cafehub.domain.review.dto.MyReviewAuthResDto;
import com.yummsters.cafehub.domain.review.dto.MyReviewListResDto;
import com.yummsters.cafehub.domain.review.dto.ReviewAuthDto;
import com.yummsters.cafehub.domain.review.dto.ReviewDetailDto;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.dto.ReviewInterface;
import com.yummsters.cafehub.domain.review.dto.ReviewListResDto;
import com.yummsters.cafehub.domain.review.dto.ReviewModifyDto;
import com.yummsters.cafehub.domain.review.dto.UserReviewListDto;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.entity.ReviewAuth;
import com.yummsters.cafehub.domain.review.service.ReviewService;
import com.yummsters.cafehub.global.response.MultiResponseDto;

@RestController
public class ReviewController {
	@Autowired
	private ReviewService reviewService;

	// 리뷰 권한
	@GetMapping("user/reviewauth/{memNo}")
	public ResponseEntity<List<ReviewAuthDto>> getReviewAuthByMemNo(@PathVariable Integer memNo) {
		try {
			List<ReviewAuth> reviewAuthList = reviewService.getReviewAuthList(memNo);
			List<ReviewAuthDto> reviewAuthDtoList = reviewAuthList.stream().map(ReviewAuthDto::fromEntity)
					.collect(Collectors.toList());
			return new ResponseEntity<>(reviewAuthDtoList, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	// 리뷰 등록
	@PostMapping("user/reviewwrite")
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
	@DeleteMapping("user/review/{reviewNo}/delete")
	public ResponseEntity<Integer> reviewDelete(@PathVariable Integer reviewNo) {
		try {
			reviewService.deleteReview(reviewNo);
			return new ResponseEntity<>(reviewNo, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	// 리뷰 수정
	@PostMapping("user/reviewmodify/{reviewNo}")
	public ResponseEntity<Integer> modifyReview(@PathVariable Integer reviewNo, @ModelAttribute ReviewModifyDto review,
			@RequestParam(value = "files", required = false) List<MultipartFile> files) {
		try {
			Integer updatedReviewNo = reviewService.modifyReview(reviewNo, review, files);
			return ResponseEntity.ok(updatedReviewNo);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().build();
		}
	}

	// 내가 쓴 리뷰
	@GetMapping("/user/myReview/{memNo}")
	public ResponseEntity<Object> getMyReview(@RequestParam("page") Integer page, @RequestParam("size") Integer size,
	        @PathVariable("memNo") Integer memNo) {
	    try {
	        Page<Review> responsePage = reviewService.findMyReview(page - 1, size, memNo);
	        List<Review> responseList = responsePage.getContent();
	        List<MyReviewListResDto> responseLists = new ArrayList<>();

	        for (Review review : responseList) {
	            MyReviewListResDto myReviewListResDto = new MyReviewListResDto(); // 객체 생성
	            responseLists.add(myReviewListResDto.reviewToMyReviewListRes(review));
	         
	        }
	        return new ResponseEntity<>(new MultiResponseDto<>(responseLists, responsePage), HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
	    }
	}
	
	// 리뷰 작성 가능 카페

	@GetMapping("user/myReviewAuth/{memNo}")
	public ResponseEntity<Object> getMyReviewAuth(@RequestParam("page") Integer page, 
	        @RequestParam("size") Integer size, @PathVariable("memNo") Integer memNo) {
	    try {
	        Page<ReviewAuth> responsePage = reviewService.findMyReviewAuth(page - 1, size, memNo);
	        List<ReviewAuth> responseList = responsePage.getContent();
	        List<MyReviewAuthResDto> responseLists = new ArrayList<>();

	        for (ReviewAuth reviewAuth : responseList) {
	            MyReviewAuthResDto myReviewAuthResDto = MyReviewAuthResDto.reviewToMyReviewAuthRes(reviewAuth);
	            responseLists.add(myReviewAuthResDto);
	        }

	        return new ResponseEntity<>(new MultiResponseDto<>(responseLists, responsePage), HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
	    }
	}

	@GetMapping("/review/{reviewNo}")
	public ResponseEntity<Object> getReviewDetail(@PathVariable Integer reviewNo,
												  @RequestParam(required = false) Integer memNo) {
		try {
			Map<String, Object> res = new HashMap<>();
			ReviewDetailDto review = reviewService.reviewDetail(reviewNo);
			res.put("review", review);
			boolean isLike = reviewService.isLikeReview(memNo, reviewNo);
			res.put("isLike", isLike);
			boolean isWish = reviewService.isWishReview(memNo, reviewNo);
			res.put("isWish", isWish);
			Integer modDate = review.getRegDate().plusDays(3).getDayOfYear() - LocalDateTime.now().getDayOfYear();
			res.put("modDate", modDate);
			return new ResponseEntity<>(res, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("member/like/{memNo}/{reviewNo}")
	public ResponseEntity<Object> isLikeReview(@PathVariable Integer memNo, @PathVariable Integer reviewNo) {
		try {
			Map<String, Object> res = new HashMap<>();
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

	@PostMapping("member/wish/{memNo}/{reviewNo}")
	public ResponseEntity<Boolean> isWishReview(@PathVariable Integer memNo, @PathVariable Integer reviewNo) {
		try {
			Boolean toggleWish = reviewService.toggleWishReview(memNo, reviewNo);
			return new ResponseEntity<>(toggleWish, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/review/storeList/{cafeNo}")
	public ResponseEntity<Object> getStoreList(@RequestParam("page") Integer page, @RequestParam("size") Integer size,
											@PathVariable("cafeNo") Integer cafeNo){
		try{
			Page<Review> reviewPage = reviewService.storeReviewPage(page-1, size, cafeNo);
			List<Review> responseList = reviewPage.getContent();
			List<ReviewListResDto> responseLists = new ArrayList<>();

			for(Review review : responseList){
				responseLists.add(ReviewListResDto.reviewToReviewListRes(review));
			}
			return new ResponseEntity<>(new MultiResponseDto<>(responseLists, reviewPage), HttpStatus.OK);
		}catch (Exception e){
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
		}
	}
	

	@GetMapping("/reviewList")
	public ResponseEntity<Page<Map<String, Object>>> getReviewList(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size, @RequestParam(defaultValue = "") String search) {
		try {
			Page<Review> reviewsPage = reviewService.getReviewList(search, PageRequest.of(page, size));

	        Page<Map<String, Object>>res = reviewsPage.map(new Function<Review, Map<String, Object>>() {

	            @Override
	            public Map<String, Object> apply(Review review) {
	                Map<String, Object> reviewData = new HashMap<>();
	                reviewData.put("thumbImg", review.getThumbImg());
	                reviewData.put("title", review.getTitle());
	                reviewData.put("subtitle", review.getSubTitle());
	                reviewData.put("cafeName", review.getCafe().getCafeName());
	                reviewData.put("likeCount", review.getLikeCount());
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
					String formattedDate = review.getRegDate().format(formatter);
	                reviewData.put("regDate", formattedDate);
	                reviewData.put("nickname", review.getMember().getNickname());
	                reviewData.put("memNo", review.getMember().getMemNo());
	                reviewData.put("badgeNo", review.getMember().getBadgeNo());
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

	// 메인 추천 리뷰 노출
	@GetMapping("/reviewList/member/{memNo}")
	public ResponseEntity<List<ReviewInterface>> getReviewsByMemNo(@PathVariable Integer memNo) {
		try {
			List<ReviewInterface> reviews = reviewService.findReviewsByMemNo(memNo);
			return new ResponseEntity<>(reviews, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	// 가게 리뷰 리스트 조회
	@GetMapping("/store/review/storeList/{cafeNo}")
	public ResponseEntity<Object> storeList(@RequestParam("page") Integer page, @RequestParam("size") Integer size,
			@PathVariable("cafeNo") Integer cafeNo) {
		try {
			Page<Review> reviewPage = reviewService.storeReviewPage(page - 1, size, cafeNo);
			List<Review> responseList = reviewPage.getContent();
			List<ReviewListResDto> responseLists = new ArrayList<>();

			for (Review review : responseList) {
				responseLists.add(ReviewListResDto.reviewToReviewListRes(review));
			}
			return new ResponseEntity<>(new MultiResponseDto<>(responseLists, reviewPage), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
		}
	}

	// 회원에 대한 작성 리뷰 조회
	@GetMapping("/userReview/{nickname}")
	public ResponseEntity<Object> userReview(@RequestParam("page") Integer page, @RequestParam("size") Integer size,
			@PathVariable("nickname") String nickname) {
		try {
			Page<Review> reviewPage = reviewService.userReviewPage(page - 1, size, nickname);
			List<Review> responseList = reviewPage.getContent();
			List<UserReviewListDto> responseLists = new ArrayList<>();

			for (Review review : responseList) {
				responseLists.add(UserReviewListDto.reviewToUserReviewListDto(review));
			}
			return new ResponseEntity<>(new MultiResponseDto<>(responseLists, reviewPage), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
		}
	}

	// 리뷰 작성 및 수정 기한에 따른 스케줄러 설정
	@Scheduled(fixedDelay = 10_800_000) // 하루 86_400_000
	public void deleteReviewAuth() throws Exception {
		reviewService.deleteReviewAuth();
	}
}
