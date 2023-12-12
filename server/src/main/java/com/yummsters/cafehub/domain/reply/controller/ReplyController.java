package com.yummsters.cafehub.domain.reply.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yummsters.cafehub.domain.reply.dto.ReplyDto;
import com.yummsters.cafehub.domain.reply.service.ReplyService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ReplyController {
	
	@Autowired
	private ReplyService replyService;
	
	@PostMapping("/replyWrite/{reviewNo}")
	public ResponseEntity<Integer> replyWrite(@PathVariable Integer reviewNo, @RequestParam String content) {
        try {
            replyService.replyWrite(reviewNo, content);
            return new ResponseEntity<Integer>(reviewNo, HttpStatus.CREATED);
        } catch (Exception e) {
        	System.out.println(content);
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
			if (memNo == null || replyNo == null) {
	            return new ResponseEntity<>("memNo 또는 replyNo가 유효하지 않습니다.", HttpStatus.BAD_REQUEST);
	        }
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
	
	@GetMapping("/reply/{reviewNo}/list")
	public ResponseEntity<Page<ReplyDto>> getRepliesByReviewNo(@PathVariable Integer reviewNo,
	                                                           @RequestParam(name="page",defaultValue = "0") int page,
	                                                           @RequestParam(name="size",defaultValue = "10") int size) {
	   System.out.println(page);
		try {
	        Pageable pageable = PageRequest.of(page, size);
	        Page<ReplyDto> replyPage = replyService.getRepliesByReviewNo(reviewNo, pageable);
	        //System.out.println(replyPage.getContent());
	        return new ResponseEntity<>(replyPage, HttpStatus.OK);
	    } catch(Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}

	@PostMapping("/reply/{replyNo}/reReply")
	public ResponseEntity<String> addReReply(@PathVariable Integer replyNo, @RequestBody ReplyDto replyDto) {
	    try {
	        replyService.addReReply(replyNo, replyDto);
	        return new ResponseEntity<>("대댓글 추가 완료", HttpStatus.CREATED);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return new ResponseEntity<>("대댓글 추가 실패", HttpStatus.BAD_REQUEST);
	    }
	}
	
	@GetMapping("/reply/{reviewNo}/best")
    public ResponseEntity<ReplyDto> getBestReplyByReviewNo(@PathVariable Integer reviewNo) {
        try {
            ReplyDto bestReply = replyService.getBestReplyByReviewNo(reviewNo);
            return new ResponseEntity<>(bestReply, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
