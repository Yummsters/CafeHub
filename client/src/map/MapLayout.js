import React, { useEffect } from "react";

const { kakao } = window;

const MapLayout = ({ cafes }) => {
  useEffect(() => {
    var mapContainer = document.getElementById("mapView"),
      mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 6, 
      };

    // 지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);
    cafes.forEach((cafe) => {
      const markerPosition = new kakao.maps.LatLng(cafe.lat, cafe.lng);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: map,
      });

      const infowindow = new kakao.maps.InfoWindow({
        content: `<div><strong>${cafe.cafeName}</strong><br />${cafe.address}</div>`,
      });

      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);
      });
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도
        const locPosition = new kakao.maps.LatLng(lat, lon); // 사용자 위치

        map.setCenter(locPosition); // 지도 중심 좌표 설정
      });
    }
  }, [cafes]);

  return <div id="mapView"></div>;
};

export default MapLayout;