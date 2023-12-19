package com.yummsters.cafehub.domain.cafeAd.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Optional;
import com.yummsters.cafehub.domain.payment.entity.Payment;
import com.yummsters.cafehub.domain.payment.repository.PaymentRepository;
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
    private final PaymentRepository paymentRepository;
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

    // 선진 part ----------------------------------------------
    // 광고 삭제
    @Override
    public boolean deleteCafeAd(Integer cafeNo) throws Exception {
        CafeAd cafeAd = cafeAdRepository.findByCafe_CafeNo(cafeNo);
        if (cafeAd != null) {
            cafeAdRepository.delete(cafeAd);
            return true; // 삭제 성공
        } else {
            return false;
        }
    }
    // 광고 결제 후 데이터 변경
    @Override
    public CafeAd paymentCafeAd(Integer cafeNo, String paymentKey) throws Exception {
        CafeAd cafeAd = cafeAdRepository.findByCafe_CafeNo(cafeNo);
        if(cafeAd != null) {
            cafeAd.updatePaid(true);
            Payment payment = paymentRepository.findByPaymentKey(paymentKey);
            if(payment != null) {
                cafeAd.addPayment(payment);
                return cafeAdRepository.save(cafeAd);
            } else {
                throw new Exception("결제정보가 존재하지 않습니다");
            }
        } else {
            throw new Exception("카페정보가 존재하지 않습니다");
        }
    }

    //혜리 part-------------------------------------------------------
	@Override
	public List<CafeAd> getApprovedAds() throws Exception {
		LocalDateTime cutoffDate = LocalDateTime.now().minusDays(7); // 7일 이전까지의 승인된 광고
	    return cafeAdRepository.findByIsApprovedAndAuthDateBefore(true, cutoffDate);

	}

	@Override
	public List<Map<String, Object>> getUnapprovedAds() throws Exception {
		List<CafeAd> unapprovedAds = cafeAdRepository.findByIsApprovedFalse();
		return convertToMapList(unapprovedAds);
	}

	@Override
	public List<Map<String, Object>> convertToMapList(List<CafeAd> cafeAds) throws Exception {
		return cafeAds.stream()
                .map(cafeAd -> {
                    Map<String, Object> cafeAdData = new HashMap<>();
                    cafeAdData.put("cafeName", cafeAd.getCafe().getCafeName());
                    cafeAdData.put("thumbImg", cafeAd.getCafe().getThumbImg());
                    cafeAdData.put("description", cafeAd.getDescription());
                    cafeAdData.put("menu", cafeAd.getMenu());
                    cafeAdData.put("regDate", cafeAd.getRegDate());
                    return cafeAdData;
                })
                .collect(Collectors.toList());
	}
}
