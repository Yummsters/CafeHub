package com.yummsters.cafehub.domain.member.controller;

import com.yummsters.cafehub.domain.member.service.PhoneCodeService;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class PhoneCodeController {
    @Autowired
    private PhoneCodeService phoneCodeService;

    @GetMapping("/check/sendSMS")
    public ResponseEntity<String> sendSMS(@RequestParam("phone") String phone,
                                          @RequestParam("code") String code) throws Exception {
        try {
            SingleMessageSentResponse response = phoneCodeService.sendPhoneCode(phone, code);
            return new ResponseEntity<>("SMS전송성공", HttpStatus.OK);
        }catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("SMS전송실패", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
