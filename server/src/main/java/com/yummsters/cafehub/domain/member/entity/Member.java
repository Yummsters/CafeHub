package com.yummsters.cafehub.domain.member.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.yummsters.cafehub.domain.badge.entity.Badge;
import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.member.dto.DefaultBadgeDto;
import com.yummsters.cafehub.domain.member.dto.ModifyReqDto;
import com.yummsters.cafehub.domain.point.entity.Point;
import com.yummsters.cafehub.domain.review.entity.Review;
import com.yummsters.cafehub.domain.review.entity.ReviewAuth;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
//@ToString(exclude = "reviews")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer memNo;

    @Column(nullable = false, unique = true)
    private String id;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column
    @Enumerated(value = EnumType.STRING)
    private Social social;

    @Column(nullable = false)
    private boolean status;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    @Enumerated(value = EnumType.STRING)
    private MemberType memberType;

    @CreatedDate
    private LocalDateTime regDate;

    @OneToMany(mappedBy = "member") @JsonIgnore
    private List<Review> reviews;

    @OneToMany(mappedBy = "member") @JsonIgnore
    private List<ReviewAuth> reviewAuths;

   /* @OneToOne(mappedBy="member")
    private Point point;*/

    @OneToOne
    @JoinColumn(name="cafe_no")
    private Cafe cafe;
    @Column
    private Integer cafeno;
    @Column(name="badge_no")
    private Integer badgeNo;

    public void setBadgeNo(Badge badge) {
        if (badge != null) {
            this.badgeNo = badge.getBadgeNo();
        }
    }
    
    public void setBadgeNo(Integer badgeNo) {
        this.badgeNo = badgeNo;
    }
    
    public void setUserInfo(String name, String nickname, String phone, String email) {
        if (name != null && !name.isEmpty()) this.name = name;
        if (nickname != null && !nickname.isEmpty()) this.nickname = nickname;
        if (phone != null && !phone.isEmpty()) this.phone = phone;
        if (email != null && !email.isEmpty()) this.email = email;
    }

    // 회원 탈퇴 시 회원 정보 삭제
    public void deleteMember(){
        this.name = "탈퇴";
        this.nickname=getNickname()+"(탈퇴회원)";
        this.status = false;
        this.phone = "탈퇴";
        this.email = getMemNo()+"탈퇴";
        this.memberType = MemberType.GUEST;
        this.regDate = null;
    }

    public DefaultBadgeDto toDTO() {
        return DefaultBadgeDto.builder()
                .memNo(this.memNo)
                .badgeNo(this.badgeNo)
               
                .build();
    }
    public void setCafeno(Integer cafeno) {
        this.cafeno = cafeno;
    }

    public void changePassword(String newPassword) { this.password = newPassword; }
}
