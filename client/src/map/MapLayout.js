import React, { useEffect, useState } from "react";
import MapCafeInfo from "./MapCafeInfo";

const { kakao } = window;

const MapLayout = ({ cafes }) => {
  const [selectCafe, setSelectCafe] = useState(null);
  const [wish, setWish] = useState(false);
  
  useEffect(() => {     
    var mapContainer = document.getElementById("mapView"),
      mapOption = {
        center: new kakao.maps.LatLng(37.4738645692092,126.885434915952), // 지도의 중심좌표
        level: 4,
      };

    // 지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);

    cafes.forEach((cafe) => {
      var imageSrc = cafe.existing
          ? "/img/map3.png" // 입점카페
          : "/img/marker_basic.png", // 기본카페
        imageSize = cafe.existing ? new kakao.maps.Size(60, 60) : new kakao.maps.Size(50, 50),
        imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커 좌표와 일치시킬 이미지 내 좌표

      // 마커이미지 생성
      var markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      const markerPosition = new kakao.maps.LatLng(cafe.lat, cafe.lng);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: map,
        image: markerImage,
      });

      kakao.maps.event.addListener(marker, "click", function () {
        // 클릭한 카페 정보 상태에 저장
        setSelectCafe(cafe);
        // 클릭한 카페에 대해 현재 회원의 찜 여부
      });
    });
    
    // if (navigator.geolocation) {
    //   // GPS 기반
    //   navigator.geolocation.getCurrentPosition(function (position) {
    //     const lat = position.coords.latitude; // 위도
    //     const lon = position.coords.longitude; // 경도
    //     const locPosition = new kakao.maps.LatLng(lat, lon); // 사용자 위치
    //     map.setCenter(locPosition); // 지도 중심 좌표 설정
    //   });
    // }
  }, [cafes]);

  return (
    <div className="mapView">
      <div id="mapView" style={{ flex: selectCafe ? 2 : "none" }}></div>
      <MapCafeInfo selectCafe={selectCafe} setSelectCafe={setSelectCafe} wish={wish} setWish={setWish}/>
    </div>
  );
};

export default MapLayout;
