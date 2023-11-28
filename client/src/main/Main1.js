// import React from 'react';
import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Main1 = () => {
    const [setting] = useState({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        initialSlide:2,
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
         
                <div className='searchbox'>
                    <Input type="text" name="search" id="search" />
                    < img className="searchImg" src='/img/search.png' />
                </div>
              <Slider {...setting}>
            <div className='banner'>
                < img className="bannerImg" src='/img/우드슬랩1.png' /> 
               
                <div className="bannerbox">
                    <span className="top-text">
                        선진언니바보,<br />
                    </span>
                    <span className="middle-text">
                        매일 갓 구운 빵을<br />
                         파는 카페<br />
                    </span>

                    <span className="last-text">
                        대표 메뉴 : 소금빵, 솔트슈페너, 쑥쑥라떼<br />
                        서울 금천구 가산디지털1로 58  에이스한솔타워 제 101호
                    </span>
                </div>

            </div>
            <div className='banner'>
                < img className="bannerImg" src='/img/우드슬랩2.png' /> 
               
                <div className="bannerbox">
                    <span className="top-text">
                        히진언니바보,<br />
                    </span>
                    <span className="middle-text">
                        매일 갓 구운 빵을<br />
                         파는 카페<br />
                    </span>

                    <span className="last-text">
                        대표 메뉴 : 소금빵, 솔트슈페너, 쑥쑥라떼<br />
                        서울 금천구 가산디지털1로 58  에이스한솔타워 제 101호
                    </span>
                </div>

            </div>
            <div className='banner'>
                < img className="bannerImg" src='/img/우드슬랩3.png'/> 
               
                <div className="bannerbox">
                    <span className="top-text">
                        혜리언니바보,<br />
                    </span>
                    <span className="middle-text">
                        매일 갓 구운 빵을<br />
                         파는 카페<br />
                    </span>

                    <span className="last-text">
                        대표 메뉴 : 소금빵, 솔트슈페너, 쑥쑥라떼<br />
                        서울 금천구 가산디지털1로 58  에이스한솔타워 제 101호
                    </span>
                </div>

            </div>
            </Slider>
            
        </div >
    );
};

export default Main1;