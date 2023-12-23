package com.yummsters.cafehub.domain.member.service;

import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import net.nurigo.sdk.NurigoApp;

import javax.annotation.PostConstruct;

@Service
public class PhoneCodeServiceImpl implements PhoneCodeService {
    @Value("${send-phone-key}")
    private String apiKey;
    @Value("${send-phone-secret-key}")
    private String secretKey;
    @Value("${soobin-phone-number}")
    private String fromNumber;
    private DefaultMessageService messageService;

    public PhoneCodeServiceImpl() {}

    @PostConstruct
    public void init() {
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, secretKey, "https://api.coolsms.co.kr");
    }

    @Override
    public SingleMessageSentResponse sendPhoneCode(String phone, String code) throws Exception {
        Message message = new Message();
        message.setFrom(fromNumber); // 발신번호
        message.setText("[CafeHub] 인증번호 : " + code + "\n타인 유출로 인한 피해 주의");
        message.setTo(phone);
        return this.messageService.sendOne(new SingleMessageSendingRequest(message));
    }
}
