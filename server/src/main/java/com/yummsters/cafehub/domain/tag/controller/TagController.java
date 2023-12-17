package com.yummsters.cafehub.domain.tag.controller;

import com.yummsters.cafehub.domain.tag.entity.ReviewTag;
import com.yummsters.cafehub.domain.tag.entity.StoreTag;
import com.yummsters.cafehub.domain.tag.repository.ReviewTagRepository;
import com.yummsters.cafehub.domain.tag.repository.StoreTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TagController {
    private final ReviewTagRepository reviewTagRepository;
    private final StoreTagRepository storeTagRepository;

    @PostMapping("/reviewTag/{tagName}")
    public void regReviewTag(@PathVariable("tagName") String tagName) throws Exception {
        if(!reviewTagRepository.existsByTagName(tagName)){
            ReviewTag reviewTag = ReviewTag.builder()
                    .tagName(tagName).build();
            reviewTagRepository.save(reviewTag);
        }else{
            throw new Exception("이미 존재하는 리뷰 태그");
        }
    }

    @PostMapping("/storeTag/{storeTagName}")
    public void regStoreTag(@PathVariable("storeTagName") String storeTagName) throws Exception {
        if(!storeTagRepository.existsByStoreTagName(storeTagName)){
            StoreTag storeTag = StoreTag.builder()
                    .storeTagName(storeTagName).build() ;
            storeTagRepository.save(storeTag);
        }else{
            throw new Exception("이미 존재하는 가게 태그");
        }
    }
}