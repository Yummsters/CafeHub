package com.yummsters.cafehub.domain.member.dto;

import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import lombok.Data;

@Data
public class SignUpPayDto {
    private Integer memNo;
    private String paymentKey;

    public SignUpPayDto signUpStoreToDto(Cafe cafe) {
        SignUpPayDto signUpPayDto = new SignUpPayDto();
        signUpPayDto.setMemNo(cafe.getCafeNo());
        signUpPayDto.setPaymentKey(cafe.getPayment().getPaymentKey());
        return signUpPayDto;
    }
}

