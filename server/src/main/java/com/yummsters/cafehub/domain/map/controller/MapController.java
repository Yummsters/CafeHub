package com.yummsters.cafehub.domain.map.controller;

import com.yummsters.cafehub.domain.map.dto.CafeDTO;
import com.yummsters.cafehub.domain.map.service.MapServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MapController {
    @Autowired
    private MapServiceImpl service;

    @GetMapping("/mapData")
    public ResponseEntity<String> saveCafe() {
        try {
            service.saveCafe();
            return new ResponseEntity<>("저장", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("저장실패", HttpStatus.BAD_REQUEST);
        }
    }
}
