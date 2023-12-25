package com.yummsters.cafehub.domain.cafeAd.dto;

import java.time.LocalDateTime;

public interface CafeAdInterface {
	String getCafeAdNo();
	Boolean getIsApproved();
	LocalDateTime getAuthDate();
	String getFileNum();
	String getCafeName();
	String getDescription();
	String getMenu();
	String getRegDate();
	String getAddress();
}
