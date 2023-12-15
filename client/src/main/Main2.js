import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Main2 = () => {
  const [settings] = useState({
    slidesToShow: 4,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2500,
    dots: true,
  });

  useEffect(() => {
    const handleResize = () => {
    
    };
   
    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='Main'>
      <div className='Main2'>
        <div className='mainbar'>
          <p className='recommendstore' style={{margin:"0"}}>당신을 위한 카페 추천</p>
        </div>
     
      <Slider {...settings}>
        
        <div className='card'>
          <img className="cardImg" src='/img/우드슬랩1.png' alt='카드 이미지' />
          <br />
          <span className="cardrecommend">
            최고급 원두를 사용하는<br />
            고급진 맛의 커피<br />
            -00카페-
          </span>
        </div>
        <div className='card'>
          <img className="cardImg" src='/img/우드슬랩2.png' alt='카드 이미지' />
          <br />
          <span className="cardrecommend">
            최고급 원두를 사용하는<br />
            고급진 맛의 커피<br />
            -00카페-
          </span>
        </div>
        <div className='card'>
          <img className="cardImg" src='/img/우드슬랩3.png' alt='카드 이미지' />
          <br />
          <span className="cardrecommend">
            최고급 원두를 사용하는<br />
            고급진 맛의 커피<br />
            -00카페-
          </span>
        </div>
        <div className='card'>
          <img className="cardImg" src='/img/우드슬랩1.png' alt='카드 이미지' />
          <br />
          <span className="cardrecommend">
            최고급 원두를 사용하는<br />
            고급진 맛의 커피<br />
            -00카페-
          </span>
        </div>
        <div className='card'>
          <img className="cardImg" src='/img/우드슬랩2.png' alt='카드 이미지' />
          <br />
          <span className="cardrecommend">
            최고급 원두를 사용하는<br />
            고급진 맛의 커피<br />
            -00카페-
          </span>
        </div>
        <div className='card'>
          <img className="cardImg" src='/img/우드슬랩3.png' alt='카드 이미지' />
          <br />
          <span className="cardrecommend">
            최고급 원두를 사용하는<br />
            고급진 맛의 커피<br />
            -00카페-
          </span>
        </div>
        <div className='card'>
          <img className="cardImg" src='/img/우드슬랩1.png' alt='카드 이미지' />
          <br />
          <span className="cardrecommend">
            최고급 원두를 사용하는<br />
            고급진 맛의 커피<br />
            -00카페-
          </span>
        </div>
        <div className='card'>
          <img className="cardImg" src='/img/우드슬랩2.png' alt='카드 이미지' />
          <br />
          <span className="cardrecommend">
            최고급 원두를 사용하는<br />
            고급진 맛의 커피<br />
            -00카페-
          </span>
        </div>
        <div className='card'>
          <img className="cardImg" src='/img/우드슬랩3.png' alt='카드 이미지' />
          <br />
          <span className="cardrecommend">
            최고급 원두를 사용하는<br />
            고급진 맛의 커피<br />
            -00카페-
          </span>
        </div>
       
      </Slider>
      </div>
    </div>
  );
};

export default Main2;
