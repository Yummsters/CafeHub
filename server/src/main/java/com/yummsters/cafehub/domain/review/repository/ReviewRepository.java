package com.yummsters.cafehub.domain.review.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.review.dto.ReviewInterface;
import com.yummsters.cafehub.domain.review.entity.Review;

import java.time.LocalDateTime;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
	Review findByReviewNo(Integer reviewNo);
	Page<Review> findByMember_MemNo(PageRequest pageRequest, Integer memNo);

	@Query(value = "SELECT * "
			+ "FROM review r "
			+ "JOIN cafe c ON r.cafe_no = c.cafe_no "
			+ "WHERE r.title like %:keyword% OR c.cafe_name like %:keyword% "
			+ "ORDER BY r.review_no DESC", nativeQuery = true)
	Page<Review> findAllByTitleContainsOrderByReviewNoDesc(@Param("keyword")String keyword, Pageable pageable);
	Page<Review> findAllByMember(Member member, Pageable pageable);
    @Query(value = "SELECT r.title, "
    		+ "r.thumb_img as thumbImg, "
    		+ "r.review_no as reviewNo, "
    		+ "r.writer as writer, "
    		+ "c.cafe_name as cafeName "
            + "FROM review r "
            + "JOIN cafe c "
            + "WHERE r.cafe_no = c.cafe_no "
            + "ORDER BY r.like_count DESC LIMIT 12", nativeQuery = true)
    List<ReviewInterface> findReviewsByMemberNoWithoutReviews();
    @Query(value = "SELECT r.title, "
    		+ "	r.thumb_img as thumbImg, "
    		+ " r.review_no as reviewNo, "
    		+ " r.writer as writer, "
    		+ "	c.cafe_name as cafeName "
            + "FROM review r "
            + "JOIN review_to_tag rtt ON r.review_no = rtt.review_no "
            + "JOIN cafe c ON r.cafe_no = c.cafe_no "
            + "WHERE rtt.tag_no = ("
            + "	SELECT rtt2.tag_no "
            + "	FROM review r2 "
            + "	JOIN review_to_tag rtt2 ON r2.review_no = rtt2.review_no "
            + " JOIN review_tag rt ON rt.tag_no = rtt2.tag_no"
            + "	WHERE r2.writer =:memNo "
            + " GROUP BY rtt2.tag_no "
            + " ORDER BY count(r2.review_no) DESC LIMIT 1"
            + ") "
            + "ORDER BY r.like_count DESC LIMIT 12", nativeQuery = true)
    List<ReviewInterface> findReviewsByMemberNoWithReviews(@Param("memNo")Integer memNo);
    Integer countByMember_MemNo(Integer memNo);

	Page<Review> findAllByCafe_CafeNo(PageRequest pageRequest, Integer cafeNo);
	Page<Review> findAllByMember_Nickname(PageRequest pageRequest, String nickname);
	List<Review> findAllByModPossibleIsTrueAndRegDateIsBefore(LocalDateTime localDateTime);
	Review findByThumbImg(String thumbImg);
}
