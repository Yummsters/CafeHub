package com.yummsters.cafehub.domain.review.service;

import java.io.File;
import java.util.HashMap;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.point.service.PointService;
import com.yummsters.cafehub.domain.review.dto.ReviewDetailDto;
import com.yummsters.cafehub.domain.review.dto.ReviewDto;
import com.yummsters.cafehub.domain.review.dto.ReviewInterface;
import com.yummsters.cafehub.domain.review.dto.ReviewModifyDto;
import com.yummsters.cafehub.domain.review.entity.FileVo;
import com.yummsters.cafehub.domain.review.entity.LikeReview;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.entity.ReviewAuth;
import com.yummsters.cafehub.domain.review.repository.FileVoRepository;
import com.yummsters.cafehub.domain.review.repository.LikeReviewRepository;
import com.yummsters.cafehub.domain.review.repository.ReviewAuthRepository;
import com.yummsters.cafehub.domain.review.repository.ReviewDetailRepository;
import com.yummsters.cafehub.domain.review.repository.ReviewRepository;
import com.yummsters.cafehub.domain.userMyPage.entity.WishReview;
import com.yummsters.cafehub.domain.userMyPage.repository.WishReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
	private final ReviewRepository reviewRepository;
	private final FileVoRepository fileVoRepository;
	private final ReviewDetailRepository detailRepository;
	private final MemberRepository memberRepository;
	private final LikeReviewRepository likeRepository;
	private final WishReviewRepository wishRepository;
	private final ReviewAuthRepository reviewAuthRepository;
	private final PointService pointService;

	// 수빈 part
	// ----------------------------------------------------------------------

	// 리뷰 권한
	@Override
	public List<ReviewAuth> getReviewAuthList(Integer memNo) throws Exception {
		return reviewAuthRepository.findByMember_MemNo(memNo);
	}

	// 리뷰 등록
	@Override
	public Integer reviewWrite(ReviewDto review, List<MultipartFile> files) throws Exception {

		if (files != null && files.size() != 0) {
			String dir = "c:/soobin/upload/"; // 수빈 업로드 경로
			//String dir = "/Users/gmlwls/Desktop/kosta/upload/"; // 희진 업로드 경로

			String fileNums = "";

			for (MultipartFile file : files) {
				FileVo fileVo = FileVo.builder().directory(dir).name(file.getOriginalFilename()).size(file.getSize())
						.contenttype(file.getContentType()).data(file.getBytes()).build();

				fileVoRepository.save(fileVo);

				// 리뷰에 썸네일 이미지를 직접 추가
				File uploadFile = new File(dir + fileVo.getFileNum());
				System.out.println("File Path: " + uploadFile.getAbsolutePath());

				file.transferTo(uploadFile);

				// file번호 목록 만들기
				if (!fileNums.equals(""))
					fileNums += ",";
				fileNums += fileVo.getFileNum();

			}

			// 파일 번호 목록을 썸네일 이미지로 사용
			review.setThumbImg(fileNums);

			// 리뷰 작성 후 리뷰 권한 삭제
			deleteReviewAuth(review.getReviewAuthNo());

			// 포인트 적립
			pointService.pointUp(review.getMemNo());
			System.out.println("getMemNo" + review.getMemNo());
		}
		Review reviewEntity = review.toEntity();
		reviewEntity.setSubTitle(reviewEntity.getCafe().getCafeName() + " " +  reviewEntity.getTitle());
		reviewRepository.save(reviewEntity);
		return reviewEntity.getReviewNo();
	}


	// 리뷰 권한 삭제
	@Override
	public void deleteReviewAuth(Integer reviewAuthNo) {
		ReviewAuth reviewAuth = reviewAuthRepository.findByReviewAuthNo(reviewAuthNo);
		if (reviewAuth != null) {
			reviewAuthRepository.delete(reviewAuth);
		}
	}

	// 리뷰 삭제
	@Override
	public void deleteReview(Integer reviewNo) throws Exception {
		Review reviewEntity = reviewRepository.findByReviewNo(reviewNo);

		if (reviewEntity != null) {
			reviewRepository.delete(reviewEntity);
		}
	}
	

	// 리뷰 수정
	@Override
	public Integer modifyReview(Integer reviewNo, ReviewModifyDto reviewModifyDto, List<MultipartFile> files) throws Exception {
	    // 기존 리뷰 정보 가져오기
	    Review review = reviewRepository.findByReviewNo(reviewNo);

	    // 리뷰 정보 업데이트
	    if (reviewModifyDto.getThumbImg() != null) {
	        review.setThumbImg(reviewModifyDto.getThumbImg());
	    }
	    if (reviewModifyDto.getTitle() != null) {
	        review.setTitle(reviewModifyDto.getTitle());
			review.setSubTitle(review.getCafe().getCafeName() + " " + reviewModifyDto.getTitle());
	    }
	    if (reviewModifyDto.getContent() != null) {
	        review.setContent(reviewModifyDto.getContent());
	    }
	    if (reviewModifyDto.getTagName() != null) {
	        review.setTagName(reviewModifyDto.getTagName());
	    }

	    if (files != null && !files.isEmpty()) {
	        String dir = "c:/soobin/upload/";
	        String fileNums = "";

	        for (MultipartFile file : files) {
	            if (!file.isEmpty()) {
	                FileVo fileVo = FileVo.builder()
	                        .directory(dir)
	                        .name(file.getOriginalFilename())
	                        .size(file.getSize())
	                        .contenttype(file.getContentType())
	                        .data(file.getBytes())
	                        .build();

	                // 파일 업로드
	                fileVoRepository.save(fileVo);

	                File uploadFile = new File(dir + fileVo.getFileNum());
	                file.transferTo(uploadFile);

	                fileNums += (fileNums.isEmpty() ? "" : ",") + fileVo.getFileNum();
	            }
	        }
	        // 파일 번호 목록을 썸네일 이미지로 사용
	        review.setThumbImg(fileNums);
	    }

	    // 리뷰 정보 저장
	    reviewRepository.save(review);

	    return review.getReviewNo();
	}


	


	// 선진 part
	// ----------------------------------------------------------------------
	@Override
	public ReviewDetailDto reviewDetail(Integer reviewNo) throws Exception {
		return detailRepository.findReviewByReviewNo(reviewNo);
	}

	@Override
	public boolean isLikeReview(Integer memNo, Integer reviewNo) throws Exception {
		return likeRepository.existsByMember_memNoAndReview_reviewNo(memNo, reviewNo);
	}

	@Override
	@Transactional
	public boolean toggleLikeReview(Integer memNo, Integer reviewNo) throws Exception {
		Review review = reviewRepository.findByReviewNo(reviewNo);
		Member member = memberRepository.findByMemNo(memNo);
		boolean isLike = likeRepository.existsByMember_memNoAndReview_reviewNo(memNo, reviewNo);
		if (isLike) {
			likeRepository.deleteByMember_memNoAndReview_reviewNo(memNo, reviewNo);
			review.setLikeCount(review.getLikeCount() - 1); // 추천 수 증가
			return false; // 추천 취소
		} else {
			likeRepository.save(LikeReview.builder().member(member).review(review).build());
			review.setLikeCount(review.getLikeCount() + 1); // 추천 수 증가
			return true; // 추천
		}
	}

	@Override
	public boolean isWishReview(Integer memNo, Integer reviewNo) throws Exception {
		return wishRepository.existsByMember_memNoAndReview_reviewNo(memNo, reviewNo);
	}

	@Override
	@Transactional
	public boolean toggleWishReview(Integer memNo, Integer reviewNo) throws Exception {
		Review review = reviewRepository.findByReviewNo(reviewNo);
		Member member = memberRepository.findByMemNo(memNo);
		boolean isWish = wishRepository.existsByMember_memNoAndReview_reviewNo(memNo, reviewNo);
		if (isWish) {
			wishRepository.deleteByMember_memNoAndReview_reviewNo(memNo, reviewNo);
			return false;
		} else {
			wishRepository.save(WishReview.builder().member(member).review(review).build());
			return true;
		}
	}


	// 희진 part
	// 가게 리뷰 리스트 조회
	@Override
	public Page<Review> storeReviewPage(Integer page, Integer size, Integer cafeNo) {
		return reviewRepository.findAllByCafe_CafeNo(PageRequest.of(page, size, Sort.by("regDate").ascending()), cafeNo);
	}

	// 닉네임 사용자의 리뷰 조회
	@Override
	public Page<Review> userReviewPage(Integer page, Integer size, String nickname){
		return reviewRepository.findAllByMember_Nickname(PageRequest.of(page, size, Sort.by("regDate").descending()), nickname);
	}

	// 전체 리뷰 권한 및 날짜에 대한 삭제 스케줄러 설정
	@Override
	public void deleteReviewAuth() throws Exception {
		// 오늘 날짜 기준 3일 전 등록된 것이라면 modPossible을 false로 변경
		List<Review> reviewList = reviewRepository.findAllByModPossibleIsTrueAndRegDateIsBefore(LocalDateTime.now().minusDays(3));
		//System.out.println(reviewList.toString());
		for(Review review : reviewList){
			review.setModPossible(false);
			reviewRepository.save(review);
		}

		// 오늘 날짜 기준 7일 전 등록된 것이라면 삭제
		//System.out.println(reviewAuthRepository.findByRegDateIsBefore(LocalDateTime.now().minusDays(7)).toString());
		reviewAuthRepository.deleteAllByRegDateIsBefore(LocalDateTime.now().minusDays(7));

	}

	// 혜리 part ----------------------------------------------------------------
	@Override
	public Page<Review> getReviewList(String search, Pageable pageable) throws Exception {
		return reviewRepository.findAllByTitleContainsOrderByReviewNoDesc(search, pageable);
	}

	@Override
	public Page<Review> getReviewsByMember(Member member, Pageable pageable) throws Exception {
		return reviewRepository.findAllByMember(member, pageable);
	}

	@Override
	public List<ReviewInterface> findReviewsByMemNo(Integer memNo) throws Exception {
	    if (memNo == null || memNo == 0) {
	        // 로그인하지 않은 회원이거나 리뷰를 작성하지 않은 회원의 경우
	        return reviewRepository.findReviewsByMemberNoWithoutReviews();
	    } else {
	        // 로그인한 회원인 경우
	        if (hasNoReviews(memNo)) {
	            // 리뷰를 작성하지 않은 회원인 경우
	            return reviewRepository.findReviewsByMemberNoWithoutReviews();
	        } else {
	            // 리뷰를 작성한 회원인 경우
	            return reviewRepository.findReviewsByMemberNoWithReviews(memNo);
	        }
	    }
	}

	@Override
	public boolean hasNoReviews(Integer memNo) throws Exception {
		return reviewRepository.countByMember_MemNo(memNo) == 0;
	}
}
