package com.yummsters.cafehub.domain.review.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.review.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
	// 수빈 part ----------------------------------------------------------------
	Review findByReviewNo(Integer reviewNo);

	// 혜리 part ----------------------------------------------------------------
	Page<Review> findAllByTitleContainsOrderByReviewNoDesc(String title, Pageable pageable);
	Page<Review> findAllByMember(Member member, Pageable pageable);
    @Query(value = "SELECT r.title, "
    		+ "r.thumb_img, "
    		+ "c.cafe_name "
            + "FROM review r "
            + "JOIN cafe c "
            + "WHERE r.cafe_no = c.cafe_no AND "
            + "ORDER BY r.like_count DESC LIMIT 12", nativeQuery = true)
    List<Object[]> findReviewsByMemberNoWithoutReviews();
    @Query(value = "SELECT r.title, "
    		+ "r.thumb_img, "
    		+ "c.cafe_name "
            + "FROM review r "
            + "JOIN cafe c ON r.cafe_no = c.cafe_no "
            + "WHERE r.tag_name in "
            + "(SELECT rt.tag_name "
            + "FROM review r2 "
            + "JOIN review_tag rt ON r2.tag_name = rt.tag_name "
            + "WHERE r2.writer =:memNo "
            + "ORDER BY COUNT(rt.tag_no) DESC) "
            + "ORDER BY r.like_count DESC LIMIT 12", nativeQuery = true)
    List<Object[]> findReviewsByMemberNoWithReviews(@Param("memNo")Integer memNo);
    Integer countByMember_MemNo(Integer memNo);
	
	// 희진 part --------
	Page<Review> findAllByCafe_CafeNo(PageRequest pageRequest, Integer cafeNo);
	Page<Review> findAllByMember_Nickname(PageRequest pageRequest, String nickname);
}
