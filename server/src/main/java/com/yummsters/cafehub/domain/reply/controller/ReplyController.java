package com.yummsters.cafehub.domain.reply.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.yummsters.cafehub.domain.reply.service.ReplyService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ReplyController {
	@Autowired
	private ReplyService replyService;

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
	
//	@PutMapping("bestReply/{reviewNo}")
//	
}
