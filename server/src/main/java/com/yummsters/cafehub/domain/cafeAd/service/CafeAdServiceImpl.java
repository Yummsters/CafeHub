package com.yummsters.cafehub.domain.cafeAd.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.cafeAd.repository.CafeAdRepository;
import com.yummsters.cafehub.domain.file.service.FileService;
import com.yummsters.cafehub.domain.review.entity.FileVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CafeAdServiceImpl implements CafeAdService{

    private final CafeAdRepository cafeAdRepository;
    private final FileService fileService;

    // 광고 신청 조회
    @Override
    public CafeAd searchCafeAd(Integer cafeNum) throws Exception{
        CafeAd cafeAd = cafeAdRepository.findByCafe_CafeNo(cafeNum);
        if(cafeAd == null) throw new Exception("신청된 광고가 없습니다.");
        return cafeAd;
    }

    // 광고 신청
    @Override
    @Transactional
    public CafeAd cafeAdSub(CafeAd cafeAd, MultipartFile thumbImg) throws Exception {
        FileVo thumbFile = null;
        if(thumbImg != null){
             thumbFile = fileService.oneFileUpload(thumbImg, cafeAd);
            cafeAd.addFile(thumbFile);
        }

        if(cafeAd != null){
            cafeAdRepository.save(cafeAd);
        }else{
            throw new Exception("광고 신청에 실패하였습니다");
        }
        return cafeAdRepository.findByCafe_CafeNo(cafeAd.getCafeAdNo());
    }

  //혜리 part-------------------------------------------------------
	@Override
	public List<CafeAd> getApprovedAds() throws Exception {
		LocalDateTime cutoffDate = LocalDateTime.now().minusDays(7); // 7일 이전까지의 승인된 광고
	    return cafeAdRepository.findByIsApprovedAndAuthDateBefore(true, cutoffDate);

	}
}
