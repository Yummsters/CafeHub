package com.yummsters.cafehub.domain.member.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@ToString
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer memberNo;

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

    @Builder
    public Member (String id, String password, String name, String nickname,
                  Social social, boolean status, String phone, String email, MemberType memberType) {
        this.id = id;
        this.password = password;
        this.name = name;
        this.nickname = nickname;
        this.social = social;
        this.status = status;
        this.phone = phone;
        this.email = email;
        this.memberType = memberType;
    }
}
