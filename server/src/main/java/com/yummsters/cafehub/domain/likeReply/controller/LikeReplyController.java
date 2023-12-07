package com.yummsters.cafehub.domain.likeReply.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.yummsters.cafehub.domain.likeReply.service.LikeReplyService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class LikeReplyController {
	
	@Autowired
	private LikeReplyService likeReplyService;
}
