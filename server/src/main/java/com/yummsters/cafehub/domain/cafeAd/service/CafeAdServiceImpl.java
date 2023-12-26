package com.yummsters.cafehub.domain.cafeAd.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.cafeAd.dto.CafeAdInterface;
import com.yummsters.cafehub.domain.cafeAd.entity.CafeAd;
import com.yummsters.cafehub.domain.cafeAd.repository.CafeAdRepository;
import com.yummsters.cafehub.domain.file.service.FileService;
import com.yummsters.cafehub.domain.payment.entity.Payment;
import com.yummsters.cafehub.domain.payment.repository.PaymentRepository;
import com.yummsters.cafehub.domain.review.entity.FileVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CafeAdServiceImpl implements CafeAdService {

	private final CafeAdRepository cafeAdRepository;
	private final PaymentRepository paymentRepository;
	private final FileService fileService;

	// 광고 신청 조회
	@Override
	public CafeAd searchCafeAd(Integer cafeNum) throws Exception {
		CafeAd cafeAd = cafeAdRepository.findByCafe_CafeNo(cafeNum);
		if (cafeAd == null)
			throw new Exception("신청된 광고가 없습니다.");
		return cafeAd;
	}

	// 광고 신청
	@Override
	@Transactional
	public CafeAd cafeAdSub(CafeAd cafeAd, MultipartFile thumbImg) throws Exception {
		FileVo thumbFile = null;
		if (thumbImg != null) {
			thumbFile = fileService.oneFileUpload(thumbImg, cafeAd);
			cafeAd.addFile(thumbFile);
		}

		if (cafeAd != null) {
			cafeAdRepository.save(cafeAd);
		} else {
			throw new Exception("광고 신청에 실패하였습니다");
		}
		return cafeAdRepository.findByCafe_CafeNo(cafeAd.getCafeAdNo());
	}

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
		if (cafeAd != null) {
			cafeAd.updatePaid(true);
			Payment payment = paymentRepository.findByPaymentKey(paymentKey);
			if (payment != null) {
				cafeAd.addPayment(payment);
				return cafeAdRepository.save(cafeAd);
			} else {
				throw new Exception("결제정보가 존재하지 않습니다");
			}
		} else {
			throw new Exception("카페정보가 존재하지 않습니다");
		}
	}

	@Override
	public List<CafeAdInterface> getApprovedAds(){
		return cafeAdRepository.findApprovedAds();
	}

	@Override
	public Page<CafeAdInterface> getUnapprovedAds(Pageable pageable){
	    return cafeAdRepository.findUnapprovedAds(pageable);
	}

	@Override
    public void approveAd(Integer cafeAdNo) throws Exception {
        Optional<CafeAd> optionalCafeAd = cafeAdRepository.findById(cafeAdNo);
        if (optionalCafeAd.isPresent()) {
            CafeAd cafeAd = optionalCafeAd.get();
            cafeAd.setApproved(true);
            cafeAd.setAuthDate(LocalDateTime.now());
            cafeAdRepository.save(cafeAd);
        } else {
            throw new Exception("CafeAd not found with id: " + cafeAdNo);
        }
    }

	@Override
	public void deleteOldRecords(){
		cafeAdRepository.deleteOldRecords(LocalDateTime.now().minusDays(7));
	}
}
