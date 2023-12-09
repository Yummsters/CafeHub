package com.yummsters.cafehub.domain.userMyPage.controller;

import com.yummsters.cafehub.domain.userMyPage.dto.WishCafeDTO;
import com.yummsters.cafehub.domain.userMyPage.dto.WishReviewDTO;
import com.yummsters.cafehub.domain.userMyPage.service.WishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class WishReviewController {
    @Autowired
    private WishService wishReviewService;

    @GetMapping("member/wishReviewList/{memNo}")
    public ResponseEntity<Object> getWishReview(@PathVariable Integer memNo) {
        try {
            List<WishReviewDTO> wishReviewList = wishReviewService.getWishReviewList(memNo);
            return new ResponseEntity<>(wishReviewList, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("member/wishStoreList/{memNo}")
    public ResponseEntity<Object> getCafeReview(@PathVariable Integer memNo) {
        try {
            List<WishCafeDTO> wishCafeList = wishReviewService.getWishCafeList(memNo);
            return new ResponseEntity<>(wishCafeList, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
