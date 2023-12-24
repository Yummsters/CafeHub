import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { url } from '../config.js'
import { useNavigate } from 'react-router';

const Main2 = () => {
  const [settings] = useState({
    slidesToShow: 4, //한 슬라이드에 보여줄 카드 개수
    slidesToScroll: 4, //스크롤 시 넘길 카드 개수
    autoplay: true,
    autoplaySpeed: 2500,
    dots: true,
  });

  const memNo = useSelector(state => state.persistedReducer.member?.memNo);
  const [reviews, setReviews] = useState([]);
  const isLogin = useSelector(state => state.persistedReducer.isLogin);
  const navigate = useNavigate();

  const handleReviewButtonClick = () => {
    if (isLogin) {
      navigate('/reviewwrite');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${url}/reviewList/member/${memNo ?? 0}`);
        setReviews(response.data);
      } catch (error) {
        console.error('리뷰 목록 조회 실패', error);
      }
    };

    fetchReviews();

    const handleResize = () => {
      // 화면 크기 변경에 대한 로직 추가
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [memNo]);

  return (
    <div className='Main'>
      <div className='Main2'>
        <div className='mainbar'>
          <p className='recommendstore' style={{ margin: '0' }}>
            당신을 위한 카페 리뷰 추천
          </p>
        </div>

        {reviews.length > 0 ? (
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <div className='card' key={index}>
                <img className='cardImg' src={`${review.thumbImg}`} alt='카드 이미지' />
                <br />
                <span className='cardrecommend'>
                  <div className='cardTitle'>{review.title}</div>
                  <div className='cardCafe'>-{review.cafeName}-</div>
                </span>
              </div>
            ))}
          </Slider>
        ) : (
          <div className='noReviewCafeRec'>
            <br/><br/><br/><br/><br/><div>작성된 카페 리뷰가 없습니다.</div><br/>
            <button id='goReviewbutton' onClick={handleReviewButtonClick}>&gt;&gt;리뷰 작성하러 가기</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main2;