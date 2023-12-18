package com.yummsters.cafehub.domain.review.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.review.entity.Review;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
	//수빈 part ----------------------------------------------------------------
	Review findByReviewNo(Integer reviewNo);
  //혜리 part ----------------------------------------------------------------
  Page<Review> findAllByTitleContainsOrderByReviewNoDesc(String title, Pageable pageable);
  Page<Review> findAllByMember(Member member, Pageable pageable);

  // 희진 part --------
  Page<Review> findAllByCafe_CafeNo(PageRequest pageRequest, Integer cafeNo);
  Page<Review> findAllByMember_Nickname(PageRequest pageRequest, String nickname);
  List<Review> findAllByModPossibleIsTrueAndRegDateIsBefore(LocalDateTime localDateTime);
}
