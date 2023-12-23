package com.yummsters.cafehub.global.auth.oauth2;

public interface OAuth2MemberInfo {
    String getEmail();
    String getNickname();
    String getProvider();
    String getProviderId();
    String getName();
}