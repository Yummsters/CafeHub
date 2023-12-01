import React from "react";
import { Table } from "reactstrap";

const MapCafeInfo = ({ selectCafe, setSelectCafe }) => {
    // null이 아닌 정보만 띄울 수 있게 만들기
    const cafeInfo = (name, src, col, text) => {
        return text !== null && text !== "" ? (
          <div className={name}>
            <img src={src} alt="" />
            <div className={col}>{text}</div>
          </div>
        ) : null;
      };

  return (
    <div style={{ flex: selectCafe ? 1 : 0 }}>
    {selectCafe && (
      <div className="map_box">
        <img
          className="x"
          src="/img/X.png"
          alt="close"
          onClick={() => setSelectCafe(null)}
        />

        <div className="store">
          <img src="/img/store.png" alt="" />
          {selectCafe.cafeName}
        </div>

        {selectCafe.thumbImg !== null ? ( 
            <div className="storeImag">
              <img src="/img/{selectCafe.tel}" alt="" />
            </div>
          ) : null}
        <div className="storeLine" />
        {cafeInfo('store_address', '/img/pin.png', 'address', selectCafe.address)}
        {cafeInfo('store_call', '/img/phone.png', 'call', selectCafe.tel)}
        {cafeInfo('store_time', '/img/clock.png', 'time', selectCafe.operTime)}
        {cafeInfo('store_type', '/img/store.png', 'type', selectCafe.tagName)}
        {cafeInfo('store_info', '/img/bean.png', 'info', "가게 정보 넣을 곳")}
        <div className="store_review">
            <img src="/img/review.png" alt=""/>
            <div className="review">리뷰</div>
        </div>
      </div>
    )}
  </div>
  )};
        
      {/* <Table hover>
        <div className="maplistbox">
          <tbody>
            <br />
            <tr>
              <div className="map-list">
                <img className="map-listImg" src="/img/우드슬랩2.png" alt="" />
                <div className="map-listTitle">
                  따뜻한 느낌의 책 읽기 좋은 카페
                  <div className="map-writeInfo">선진언니바보</div>
                </div>

                <div className="map-dateTime">2023.11.15 11:01</div>
              </div>
            </tr>
            <tr>
              <div className="map-list">
                <img className="map-listImg" src="/img/우드슬랩2.png" alt="" />
                <div className="map-listTitle">
                  따뜻한 느낌의 책 읽기 좋은 카페
                  <div className="map-writeInfo">선진언니바보</div>
                </div>

                <div className="map-dateTime">2023.11.15 11:01</div>
              </div>
            </tr>
            <tr>
              <div className="map-list">
                <img className="map-listImg" src="/img/우드슬랩2.png" alt="" />
                <div className="map-listTitle">
                  따뜻한 느낌의 책 읽기 좋은 카페
                  <div className="map-writeInfo">선진언니바보</div>
                </div>

                <div className="map-dateTime">2023.11.15 11:01</div>
              </div>
            </tr>
            <tr>
              <div className="map-list">
                <img className="map-listImg" src="/img/우드슬랩2.png" alt="" />
                <div className="map-listTitle">
                  따뜻한 느낌의 책 읽기 좋은 카페
                  <div className="map-writeInfo">선진언니바보</div>
                </div>

                <div className="map-dateTime">2023.11.15 11:01</div>
              </div>
            </tr>
            <tr>
              <div className="map-list">
                <img className="map-listImg" src="/img/우드슬랩2.png" alt="" />
                <div className="map-listTitle">
                  따뜻한 느낌의 책 읽기 좋은 카페
                  <div className="map-writeInfo">선진언니바보</div>
                </div>

                <div className="map-dateTime">2023.11.15 11:01</div>
              </div>
            </tr>
            <tr></tr>
          </tbody>
        </div>
        <div className="pagination">
          <div className="prevPage">&lt;</div>
          <div className="page">1 2 3 맵사용해~</div>
          <div className="nextPage">&gt;</div>
        </div>
      </Table> */}

export default MapCafeInfo;
