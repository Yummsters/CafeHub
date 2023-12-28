import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../config.js'
import MapCafeInfo from '../map/MapCafeInfo.js';
const { kakao } = window;

const MainMap = () => {
  const [cafes, setCafes] = useState([]);
  const [cafeNo, setCafeNo] = useState(0);
  const [wish, setWish] = useState(true);
  const [selectCafe, setSelectCafe] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`${url}/mapMarker`)
    .then(response => {
      setCafes(response.data);
    })
    .catch(error => {
      console.error('에러:', error);
    });
  }, []); 

  useEffect(() => {
    var mapContainer = document.getElementById("mapView"),
      mapOption = {
        center: new kakao.maps.LatLng(37.4738645692092, 126.885434915952), // 지도의 중심좌표
        level: 6,
      };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    cafes.forEach((cafe) => {
      var imageSrc = cafe.existing
          ? "/img/map3.png" // 입점카페
          : "/img/marker_basic.png", // 기본카페
        imageSize = cafe.existing ? new kakao.maps.Size(60, 60) : new kakao.maps.Size(30, 30),
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
      kakao.maps.event.addListener(marker, 'click', function () {
        setCafeNo(cafe.cafeNo);
        setSelectCafe(cafe);
        setShowModal(true);
      });
    });

    // if (navigator.geolocation) { // GPS 기반
    //   navigator.geolocation.getCurrentPosition(function (position) {
    //     const lat = position.coords.latitude; // 위도
    //     const lon = position.coords.longitude; // 경도
    //     const locPosition = new kakao.maps.LatLng(lat, lon); // 사용자 위치
    //     map.setCenter(locPosition); // 지도 중심 좌표 설정
    //   });
    // }
  }, [cafes]);

  const closeModal = () => {
    setShowModal(false);
  };

return (
  <>
    <div id="mapView"></div>
    {showModal && selectCafe && (
      <div className="modalBox">
          <img className="closeBtn" onClick={closeModal} src="/img/X.png" width={"70px"} alt=""/>
          <div className="cafeModalContent">
          <div className='modalMap'>
            <MapCafeInfo wishModal={true} selectCafe={selectCafe} wishCafeNo={cafeNo} wish={wish} setWish={setWish}/>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default MainMap;