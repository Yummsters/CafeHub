import React, { useEffect, useState } from 'react';
import axios from 'axios';
const { kakao } = window;

const MainMap = () => {
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/mapMarker')
    .then(response => {
      setCafes(response.data);
      console.log(response.data);
    })
    .catch(error => {
      console.error('에러:', error);
    });
  }, []); 

  useEffect(() => {
    var mapContainer = document.getElementById("mapView"),
      mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 6,
      };

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

      const infowindow = new kakao.maps.InfoWindow({
        content: cafe.cafeName,
      });
  
      // 마커에 마우스 호버 이벤트 추가
      kakao.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, marker);
      });
  
      kakao.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
      });
    });

    if (navigator.geolocation) { // GPS 기반
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도
        const locPosition = new kakao.maps.LatLng(lat, lon); // 사용자 위치
        map.setCenter(locPosition); // 지도 중심 좌표 설정
      });
    }
  }, [cafes]);

return (
    <div id="mapView"></div>
  );
};

export default MainMap;