package com.yummsters.cafehub.domain.member.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.yummsters.cafehub.domain.cafe.entity.Cafe;
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

    public void setName(String name) {
        this.name = name;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void changeStatus(boolean status) {
        this.status = status;
    }
       
    public void changeStatus(boolean status) {
        this.status = status;
    }

    public void setCafeno(Integer cafeno) {
        this.cafeno = cafeno;
    }

    public void changePassword(String newPassword) { this.password = newPassword; }
}
