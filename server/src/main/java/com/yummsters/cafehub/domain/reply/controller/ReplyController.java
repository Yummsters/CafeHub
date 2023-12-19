package com.yummsters.cafehub.domain.reply.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yummsters.cafehub.domain.reply.dto.MyReplyListResDto;
import com.yummsters.cafehub.domain.reply.entity.Reply;
import com.yummsters.cafehub.global.response.MultiResponseDto;
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
import com.yummsters.cafehub.domain.reply.dto.ReplyInterface;
import com.yummsters.cafehub.domain.reply.service.ReplyService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ReplyController {
	@Autowired
	private ReplyService replyService;
	
	@PostMapping("/replyWrite/{memNo}/{reviewNo}")
	public ResponseEntity<Integer> replyWrite(@PathVariable Integer memNo, @PathVariable Integer reviewNo, @RequestBody Map<String, String> data) {
		String content = data.get("content");
        try {
            replyService.replyWrite(memNo, reviewNo, content);
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
	public ResponseEntity<Page<ReplyInterface>> getRepliesByReviewNo(@PathVariable Integer reviewNo,
															   @RequestParam(name="memNo",defaultValue="0") int memNo,
	                                                           @RequestParam(name="page",defaultValue = "0") int page,
	                                                           @RequestParam(name="size",defaultValue = "10") int size) {
	   System.out.println(page);
		try {
	        Pageable pageable = PageRequest.of(page, size);
	        Page<ReplyInterface> replyPage = replyService.getRepliesByReviewNo(memNo, reviewNo, pageable);
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
    public ResponseEntity<ReplyInterface> getBestReplyByReviewNo(@PathVariable Integer reviewNo, @RequestParam(required=false, defaultValue = "0") Integer memNo) {
        try {
        	ReplyInterface bestReply = replyService.getBestReplyByReviewNo(memNo, reviewNo);
            return new ResponseEntity<>(bestReply, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

	// 회원 댓글 조회
	@GetMapping("/user/reply/{memNo}")
	public ResponseEntity<Object> getMyReply(@RequestParam("page") Integer page, @RequestParam("size") Integer size,
										@PathVariable("memNo") Integer memNo){
		try{
			Page<Reply> responsePage = replyService.findMyReply(page-1, size, memNo);
			List<Reply> responseList = responsePage.getContent();
			List<MyReplyListResDto> responseLists = new ArrayList<>();

			for(Reply reply : responseList){
				responseLists.add(MyReplyListResDto.replyToMyReplyListRes(reply));
			}
			return new ResponseEntity<>(new MultiResponseDto<>(responseLists, responsePage), HttpStatus.OK);

		}catch (Exception e){
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}
}
