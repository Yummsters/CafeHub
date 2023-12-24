import "./wishStoreStyle.css";
import UserSideTab from "../components/UserSideTab";
import { useEffect, useState } from "react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import MapCafeInfo from "../map/MapCafeInfo";
import { url } from '../config.js'
import { checkToLogin } from "../login/TokenCheck.js";
import { useNavigate } from "react-router";
const {kakao} = window;

const WishStore = () => {
  const [wishStoreList, setWishStoreList] = useState([]);
  const [cafeNo, setCafeNo] = useState(0);
  const [wish, setWish] = useState(true);
  const [selectCafe, setSelectCafe] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const memNo = useSelector((state) => state.persistedReducer.member.memNo);
  const accessToken = useSelector((state) => state.persistedReducer.accessToken);
  const isLogin = useSelector((state) => state.persistedReducer.isLogin);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const onClick = (cafeNo) => {
    if (isLogin) {
      checkToLogin(dispatch, accessToken, navigate)
    }
    setCafeNo(cafeNo);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // 부모페이지 스크롤 비활성화
  }

  const closeModal = () => {
    if (isLogin) {
      checkToLogin(dispatch, accessToken, navigate)
    }
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (isLogin) {
      checkToLogin(dispatch, accessToken, navigate)
    }
      axios.get(`${url}/member/wishStoreList/${memNo}?page=${currentPage-1}`, {
        headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setWishStoreList(res.data.data);
        setTotalPages(res.data.pageInfo.totalPages);
      })
      .catch((error) => {
        console.error("에러:" + error);
      });
  }, [cafeNo, currentPage]);
  
  useEffect(() => { // 디테일 지도(모달)
    if (showModal && cafeNo !== 0) {
      axios.get(`${url}/map/${cafeNo}`)
      .then((res) => {
        setSelectCafe(res.data);
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }, [cafeNo]);

  useEffect(() => { // 모달 띄울 카페 지도
    if (showModal && cafeNo !== 0 && selectCafe && selectCafe.lat && selectCafe.lng) {
      const mapContainer = document.getElementById("mapView2");
      const mapOption = {
        center: new kakao.maps.LatLng(selectCafe.lat, selectCafe.lng),
        level: 3,
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);
      const markerPosition = new kakao.maps.LatLng(selectCafe.lat, selectCafe.lng);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    }
  }, [showModal, cafeNo, selectCafe]);

  return (
    <div className="wishStore-container">
      <UserSideTab />
      <div className="wishStore-list">
        <div className="wishStore-title">
          <img src="/img/y_star.png" alt="" width={"30px"}/> <span> 찜한 가게 </span>
        </div>
            {wishStoreList.length !== 0 ?
                wishStoreList.map((store, index) => (
                <span className="wishStore-stores" key={index} onClick={() => onClick(store.cafeNo)}>
                <img src={store.thumbImg ? `${url}/common/thumbImg/${store.thumbImg}` : '/img/Review1.png'} alt=""/>
                <div className="image-text">{store.cafeName}</div>
                {/* {index % 4 === 3 ? (<><br /></>) : ("")} */}
                </span>
            )) : <div className="noWish">찜한 가게가 없습니다</div>}

            {wishStoreList.length !== 0  && (
              <div className="pagination-container">
                <Pagination>
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={prevPage} />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index} active={currentPage === index + 1}>
                        <PaginationLink onClick={() => setCurrentPage(index + 1)}>
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  <PaginationItem disabled={currentPage === totalPages}>
                    <PaginationLink next onClick={nextPage} />
                  </PaginationItem>
                </Pagination>
              </div>
          )}

        {showModal && selectCafe && (
          <div className="modalBox">
              <img className="closeBtn" onClick={closeModal} src="/img/X.png" width={"70px"} alt=""/>
              <div className="cafeModalContent">
              <div className='modalMap'>
                <div id="mapView2"></div>
                <MapCafeInfo wishModal={true} selectCafe={selectCafe} wishCafeNo={cafeNo} wish={wish} setWish={setWish}/>
              </div>
            </div>
          </div>
        )}

        
              
      </div>
    </div>
  );
};

export default WishStore;
