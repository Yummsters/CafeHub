// import React from 'react';
import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';

const Main1 = () => {

    const [searchKeyword, setSearchKeyword] = useState('');
    const [cafeAds, setCafeAds] = useState([]);
    const [setting] = useState({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        initialSlide: 2,
    });

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleSearch = () => {
        window.location.href = `/reviewList?search=${encodeURIComponent(searchKeyword)}`;
    };

    useEffect(() => {
        const handleResize = () => { };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8080/cafeAd/approvedAds`)
            .then((response) => {
                console.log(response);
                setCafeAds(response.data);
            })
            .catch(error => {
                console.error('카페 광고 가져오기 오류:', error);
            })
    }, []);

    return (
        <div className='Main'>

            <div className='searchbox'>
                <Input type="text" name="search" id="search" value={searchKeyword} onChange={handleSearchChange} />
                < img className="searchImg" src='/img/search.png' onClick={handleSearch} alt="검색" />
            </div>
            <Slider {...setting}>

                {cafeAds.map((ad, index) => (
                    <div key={index} className='banner'>
                        <img className="bannerImg" src={ad.thumbImg} alt='' />

                        <div className="bannerbox">
                            <div className="top-text">{ad.cafeName},</div>
                            <div className="middle-text"><br/>{ad.description}</div>
                            <div className="last-text">
                                <div className="adMenuList">{ad.menu}</div>
                                <div className="adAddress">{ad.address}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>

        </div >
    );
};

export default Main1;
