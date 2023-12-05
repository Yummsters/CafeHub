package com.yummsters.cafehub.domain.reply.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yummsters.cafehub.domain.reply.service.ReplyService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ReplyController {
	
	@Autowired
	private ReplyService replyService;
	
	@PostMapping("/review/{reviewNo}")
	public ResponseEntity<Integer> replyWrite(@PathVariable Integer reviewNo, @RequestParam String content) {
        try {
            replyService.replyWrite(reviewNo, content);
            return new ResponseEntity<Integer>(reviewNo, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<Integer>(HttpStatus.BAD_REQUEST);
        }
    }

	@DeleteMapping("/replyDelete/{replyNo}")
	public ResponseEntity<Integer> replyDelete(@PathVariable Integer replyNo) {
		try {
			replyService.replyDelete(replyNo);
			return new ResponseEntity<Integer>(replyNo, HttpStatus.OK);
		} catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Integer>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/replyLike/{memNo}/{replyNo}")
	public ResponseEntity<Object> isLikeReply(@PathVariable Integer memNo, @PathVariable Integer replyNo) {
		try {
			Map<String, Object> res = new HashMap<>();
			boolean isToggleLike = replyService.toggleLikeReply(memNo, replyNo);
			res.put("isToggleLike", isToggleLike);
			Integer likeCount = replyService.getLikeCount(replyNo);
			res.put("likeCount", likeCount);
			return new ResponseEntity<>(res, HttpStatus.OK);
		} catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
//	@PutMapping("/bestReply/{reviewNo}")
	
}
