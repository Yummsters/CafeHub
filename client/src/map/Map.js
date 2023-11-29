import React, { useEffect, useState } from 'react';
import './mapStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import MapLayout from './MapLayout';
import axios from 'axios';

const Map = () => {
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

return (
    <div className='Map'>
      <MapLayout cafes={cafes}/>
      {/* <div className='map_box'>
        <img className='x' src='/img/X.png' />
        <div className='store'>
          <img src='/img/store.png' />
          선진언니바보 가게
        </div>
        <img className='storeImag' src='/img/우드슬랩1.png' />
        <div className='storeLine' />
        <div className='store_address'>
          <img src='/img/pin.png' />
          <div className='address'>
            서울특별시 강남구
          </div>
        </div>
        <div className='store_call'>
          <img src='/img/phone.png' />
          <div className='call'>
            02-123-4567
          </div>
        </div>
        <div className='store_time'>
          <img src='/img/clock.png' />
          <div className='time'>
            10:00~18:00
          </div>
        </div>
        <div className='store_type'>
          <img src='/img/store.png' />
          <div className='call'>
            애견동반카페
          </div>
        </div>
        <div className='store_info'>
          <img src='/img/bean.png' />
          <div className='info'>
            가게 정보
          </div>
        </div>
        <div className='map_storemap' />
        <div className='store_review'>
          <img src='/img/review.png' />
          <div className='review'>
            리뷰
          </div>
        </div>
        <Table hover>
        <div className='maplistbox'>
          <tbody>
            <br />
            <tr >

              <div className='map-list'>
                <img className='map-listImg' src='/img/우드슬랩2.png' alt='' />
                <div className='map-listTitle'>따뜻한 느낌의 책 읽기 좋은 카페

                  <div className='map-writeInfo'>
                    선진언니바보
                  </div>
                </div>

                <div className='map-dateTime'>2023.11.15 11:01</div>
              </div>
            </tr>
            <tr>

              <div className='map-list'>
                <img className='map-listImg' src='/img/우드슬랩2.png' alt='' />
                <div className='map-listTitle'>따뜻한 느낌의 책 읽기 좋은 카페

                  <div className='map-writeInfo'>
                    선진언니바보
                  </div>
                </div>

                <div className='map-dateTime'>2023.11.15 11:01</div>
              </div>
            </tr>
            <tr>

              <div className='map-list'>
                <img className='map-listImg' src='/img/우드슬랩2.png' alt='' />
                <div className='map-listTitle'>따뜻한 느낌의 책 읽기 좋은 카페

                  <div className='map-writeInfo'>
                    선진언니바보
                  </div>
                </div>

                <div className='map-dateTime'>2023.11.15 11:01</div>
              </div>
            </tr>
            <tr>

              <div className='map-list'>
                <img className='map-listImg' src='/img/우드슬랩2.png' alt='' />
                <div className='map-listTitle'>따뜻한 느낌의 책 읽기 좋은 카페

                  <div className='map-writeInfo'>
                    선진언니바보
                  </div>
                </div>

                <div className='map-dateTime'>2023.11.15 11:01</div>
              </div>
            </tr>
            <tr>
              <div className='map-list'>
                <img className='map-listImg' src='/img/우드슬랩2.png' alt='' />
                <div className='map-listTitle'>따뜻한 느낌의 책 읽기 좋은 카페

                  <div className='map-writeInfo'>
                    선진언니바보
                  </div>
                </div>

                <div className='map-dateTime'>2023.11.15 11:01</div>
              </div>
            </tr>
            <tr>
            </tr>
            
          </tbody>
          </div>
        <div className='pagination'>
          <div className='prevPage'>&lt;</div>
          <div className='page'>1 2 3 맵사용해~</div>
          <div className='nextPage'>&gt;</div>
        </div>
        </Table>


      </div> */}
    </div>
  );
};

export default Map;