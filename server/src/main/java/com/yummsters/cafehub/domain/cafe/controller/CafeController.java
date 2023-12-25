package com.yummsters.cafehub.domain.cafe.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yummsters.cafehub.domain.cafe.service.CafeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.cafe.dto.CafeDto;
import com.yummsters.cafehub.domain.cafe.dto.ModifyCafeDto;
import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.cafe.service.CafeServiceImpl;

@RestController
public class CafeController {
    @Autowired
    private CafeService service;

    @GetMapping("/mapData") // 카페 데이터 저장
    public ResponseEntity<String> saveCafe() {
        try {
            service.saveCafe();
            return new ResponseEntity<>("저장", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("저장실패", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/mapMarker") // 카페 리스트 지도에 뿌리기
    public ResponseEntity<Object> getAllCafes() {
        try {
            List<CafeDto> cafes = service.getCafes(); // 서비스에서 DTO 목록을 가져옴
            return new ResponseEntity<>(cafes, HttpStatus.OK); // 클라이언트에 반환
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("member/cafeIsWish/{memNo}/{cafeNo}") // 특정 카페의 찜 여부
    public ResponseEntity<Boolean> isWish(@PathVariable Integer memNo, @PathVariable Integer cafeNo) {
        try {
            Boolean isWish = service.isWishCafe(memNo, cafeNo);
            return new ResponseEntity<>(isWish, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("member/cafeWish/{memNo}/{cafeNo}") // 특정 카페 찜하기
    public ResponseEntity<Boolean> isWishCafe(@PathVariable Integer memNo, @PathVariable Integer cafeNo) {
        try {
            Boolean toggleWish = service.toggleWishCafe(memNo, cafeNo);
            return new ResponseEntity<>(toggleWish, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("map/{cafeNo}") // 찜한 카페 위치(하나만)
    public ResponseEntity<Object> getCafeByCafeNo(@PathVariable Integer cafeNo) {
        try {
            CafeDto cafe = service.getCafeByCafeNo(cafeNo);
            return new ResponseEntity<>(cafe, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 혜리 part---------------------------------------------------------------------------
    @GetMapping("/manager/managerConfirm")
    public ResponseEntity<Object> getUnpaidCafes(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "5") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CafeDto> unpaidCafes = service.getUnpaidCafes(pageable);
            List<CafeDto> responseList = unpaidCafes.getContent();
            Map<String, Object> res = new HashMap<>();
            res.put("unpaidCafes", unpaidCafes);
            res.put("responseList", responseList);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    // 수빈 part---------------------------------------------------------------------------
    @GetMapping("/cafe/{cafeNo}")
    public ResponseEntity<Object> getCafeInfo(@PathVariable Integer cafeNo) {
        try {
            Cafe cafe = service.getCafeInfo(cafeNo);
            
            if (cafe != null) {
                CafeDto cafeDto = cafe.toDTO();
                return new ResponseEntity<>(cafeDto, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/cafe/store/{cafeNo}")
    public ResponseEntity<Object> modifyCafeInfo(
            @PathVariable Integer cafeNo,
            @ModelAttribute ModifyCafeDto modifyCafeDto,
            @RequestParam(value = "file", required = false) List<MultipartFile> files) {
        try {
            Integer updatedCafeNo = service.modifyCafe(cafeNo, modifyCafeDto, files);
            return ResponseEntity.ok(updatedCafeNo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }


}
