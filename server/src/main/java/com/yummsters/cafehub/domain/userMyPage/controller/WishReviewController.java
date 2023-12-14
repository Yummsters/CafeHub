package com.yummsters.cafehub.domain.userMyPage.controller;

import com.yummsters.cafehub.domain.userMyPage.dto.WishCafeDto;
import com.yummsters.cafehub.domain.userMyPage.dto.WishReviewDto;
import com.yummsters.cafehub.domain.userMyPage.service.WishService;
import com.yummsters.cafehub.global.response.MultiResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class WishReviewController {
    @Autowired
    private WishService wishReviewService;
    @GetMapping("member/wishStoreList/{memNo}")
    public ResponseEntity<Object> getCafeReview(@PathVariable Integer memNo,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "12") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            MultiResponseDto<WishCafeDto> wishCafeList = wishReviewService.getWishCafeList(memNo, pageable);
            return new ResponseEntity<>(wishCafeList, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("member/wishReviewList/{memNo}")
    public ResponseEntity<Object> getWishReview(@PathVariable Integer memNo,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "12") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            MultiResponseDto<WishReviewDto> wishReviewList = wishReviewService.getWishReviewList(memNo, pageable);
            return new ResponseEntity<>(wishReviewList, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
