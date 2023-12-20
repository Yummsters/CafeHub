import React, { useEffect, useRef, useState } from "react";
import MapCafeInfo from "./MapCafeInfo";
import axios from "axios";
import { useSelector } from "react-redux";

const { kakao } = window;

const MapLayout = ({ cafes }) => {
  const [selectCafe, setSelectCafe] = useState(null);
  const [wish, setWish] = useState(false);
  const memNo = useSelector(state=>state.persistedReducer.member.memNo);

  useEffect(() => {
    var mapContainer = document.getElementById("mapView"),
      mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 6,
      };

    // 지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);

    cafes.forEach((cafe) => {
      console.log(cafe.existing);
      var imageSrc = cafe.existing
          ? "/img/marker_in.png"
          : "/img/marker_out.png", // 마커이미지 주소
        imageSize = new kakao.maps.Size(60, 60), // 마커이미지의 크기
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
        console.log(cafe);

        // 클릭한 카페에 대해 현재 회원의 찜 여부
        axios.get(`http://localhost:8080/cafeIsWish/${memNo}/${cafe.cafeNo}`) 
        .then((res) => {
            setWish(res.data);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    });
    if (navigator.geolocation) {
      // GPS 기반
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도
        const locPosition = new kakao.maps.LatLng(lat, lon); // 사용자 위치
        map.setCenter(locPosition); // 지도 중심 좌표 설정
        console.log(locPosition);
      });
    }
  }, [cafes]);

  return (
    <div className="mapView">
      <div id="mapView" style={{ flex: selectCafe ? 2 : "none" }}></div>
      <MapCafeInfo selectCafe={selectCafe} setSelectCafe={setSelectCafe} wish={wish} setWish={setWish}/>
    </div>
  );
};

export default MapLayout;
