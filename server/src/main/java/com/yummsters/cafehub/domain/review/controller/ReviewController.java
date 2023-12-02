package com.yummsters.cafehub.domain.review.controller;

import java.util.List;

import com.yummsters.cafehub.domain.review.entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.service.ReviewService;

@RestController
public class ReviewController {
	@Autowired
	private ReviewService reviewService;
	
//	@GetMapping("/cafelist")
//	public ResponseEntity<Object>cafelist(){
//		try {
//			Review cafel = reviewService.reviewInfo(writer);
//			return new ResponseEntity<Object>(cafel, HttpStatus.OK );
//			
//		} catch (Exception e) {
//			e.printStackTrace();
//			return new ResponseEntity<Object>(e.getMessage(),HttpStatus.BAD_REQUEST);
//		}
//	}
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

    @GetMapping("/review/{reviewNo}")
    public ResponseEntity<ReviewDto> getReviewDetail(@PathVariable Integer reviewNo) {
        try {
            ReviewDto review = reviewService.reviewDetail(reviewNo);
            return new ResponseEntity<>(review, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
