package com.yummsters.cafehub.domain.mypage.controller;

import com.yummsters.cafehub.domain.mypage.dto.WishReviewDTO;
import com.yummsters.cafehub.domain.mypage.dto.WishStoreDTO;
import com.yummsters.cafehub.domain.mypage.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    // 선진 part ----------------------------------------------------------------------
    @GetMapping("member/wishReviewList/{memNo}")
    public ResponseEntity<Object> getWishReview(@PathVariable Integer memNo) {
        try {
            List<WishReviewDTO> wishReviewList = userService.getWishReviewList(memNo);
            return new ResponseEntity<>(wishReviewList, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("member/wishStoreList/{memNo}")
    public ResponseEntity<Object> getWishStore(@PathVariable Integer memNo) {
        try {
            List<WishStoreDTO> wishStoreList = userService.getWishStoreList(memNo);
            return new ResponseEntity<>(wishStoreList, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    // 선진 part ----------------------------------------------------------------------

}
