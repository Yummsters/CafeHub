package com.yummsters.cafehub.domain.member.service;

import net.nurigo.sdk.message.response.SingleMessageSentResponse;

public interface PhoneCodeService {
    SingleMessageSentResponse sendPhoneCode(String phone, String code) throws Exception;
}
