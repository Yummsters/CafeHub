package com.yummsters.cafehub.global.auth.oauth2;

import java.util.Map;

public class KakaoMemberInfo implements OAuth2MemberInfo {
    private Map<String,Object> attributes;

    public KakaoMemberInfo(Map<String,Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProvider() {
        return "Kakao";
    }

    @Override
    public String getProviderId() {
        return String.valueOf(attributes.get("id"));
    }

    @Override
    public String getEmail() {
        return (String)(((Map<String,Object>)attributes.get("kakao_account")).get("email"));
    }

    @Override
    public String getNickname() {
        return (String) (((Map<String,Object>)attributes.get("properties")).get("nickname"));
    }
}
