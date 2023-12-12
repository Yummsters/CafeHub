package com.yummsters.cafehub.domain.member.controller;

import com.yummsters.cafehub.domain.member.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BusinessController {
    @Autowired
    private BusinessService businessService;

    @PostMapping("business/{businessNo}")
    public ResponseEntity<String> businessCheck(@PathVariable(name = "businessNo") String businessNo) {
        try {
            String result = businessService.buisnessExist(businessNo);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
