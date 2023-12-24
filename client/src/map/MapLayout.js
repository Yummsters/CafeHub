import React, { useEffect, useState } from "react";
import MapCafeInfo from "./MapCafeInfo";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router';
import { url } from '../config.js'
import { getCookie, setCookie, removeCookie } from "../components/Cookie.js";
import {normalCheck, tokenCreate, tokenExpried} from '../login/TokenCheck';
import Swal from 'sweetalert2';

const { kakao } = window;

const MapLayout = ({ cafes }) => {
  const [selectCafe, setSelectCafe] = useState(null);
  const [wish, setWish] = useState(false);
  const memNo = useSelector(state=>state.persistedReducer.member.memNo);
  const accessToken = useSelector(state => state.persistedReducer.accessToken);
  const isLogin = useSelector(state => state.persistedReducer.isLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

    // swal
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 800,
      timerProgressBar: true,
      didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
  
  useEffect(() => {
    if (isLogin) {
      normalCheck(dispatch, accessToken)
     }
     
    var mapContainer = document.getElementById("mapView"),
      mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 6,
      };

    // 지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);

    cafes.forEach((cafe) => {
      var imageSrc = cafe.existing
          ? "/img/marker_in.png" // 입점카페
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

      kakao.maps.event.addListener(marker, "click", function () {
        // 클릭한 카페 정보 상태에 저장
        setSelectCafe(cafe);
        // 클릭한 카페에 대해 현재 회원의 찜 여부
        if (memNo != null) { 
          axios.get(`${url}/member/cafeIsWish/${memNo}/${cafe.cafeNo}`, {
              headers : {
                  Authorization :accessToken,
                  Refresh : getCookie("refreshToken")
              }
          })
          .then((res) => {
            tokenCreate(dispatch, setCookie, res.headers)
              .then((r)=>{
                  setWish(res.data);
              })
            })
          .catch((error) => {
            if(error.response !== undefined){
                tokenExpried(dispatch, removeCookie, error.response.data, navigate);
            } else {
                Toast.fire({
                    icon: 'error',
                    title: error
                })
            }
          })
        }
      });
    });
    if (navigator.geolocation) {
      // GPS 기반
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도
        const locPosition = new kakao.maps.LatLng(lat, lon); // 사용자 위치
        map.setCenter(locPosition); // 지도 중심 좌표 설정
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
