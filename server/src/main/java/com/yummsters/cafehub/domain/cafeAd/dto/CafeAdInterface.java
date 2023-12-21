package com.yummsters.cafehub.domain.cafeAd.dto;

import java.time.LocalDateTime;

public interface CafeAdInterface {
	String getCafeAdno();
	boolean getIsApproved();
	LocalDateTime getAuthDate();
	String getThumbImg();
	String getCafeName();
	String getDescription();
	String getMenu();
	String getRegDate();
}