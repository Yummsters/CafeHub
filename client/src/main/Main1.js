// import React from 'react';
import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { url } from '../config.js'

const Main1 = () => {

    const [searchKeyword, setSearchKeyword] = useState('');
    const [approvedAds, setApprovedAds] = useState([]);
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
        axios.get(`${url}/cafeAd/approvedAds`)
            .then((response) => {
                setApprovedAds(response.data);
            })
            .catch(error => {
                console.error('카페 광고 가져오기 오류:', error);
            })
    }, []);

    return (
        <div className='Main'>
            <div className='searchbox'>
                <Input type="text" name="search" id="search" value={searchKeyword} onChange={handleSearchChange} />
                < img className="searchImg" src='/img/searchIcon.png' onClick={handleSearch} alt="검색" />
            </div>
            {approvedAds.length > 0 ? (
                <Slider {...setting}>
                    {approvedAds.map((ad, index) => (
                        <div key={index} className='banner'>
                            <img className="bannerImg" src={`${url}/common/upload/${ad.fileNum}`} alt='' />
                            <div className="bannerbox">
                                <div className="top-text">{ad.cafeName},</div>
                                <div className="middle-text"><br />{ad.description}</div>
                                <div className="last-text">
                                    <div className="adMenuList">{ad.menu}</div>
                                    <div className="adAddress">{ad.address}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className='banner'>
                    <img className="bannerImg" src={`img/cafeHubMain.png`} alt='' />
                    <div className="bannerbox">
                        <div className="top-text">카페허브,</div>
                        <div className="middle-text"><br />카페에 관한 모든 것</div>
                        <div className="last-text">
                            <div className="adMenuList">리뷰 작성 및 열람부터</div>
                            <div className="adAddress">커피콩으로 할인까지</div>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
};

export default Main1;
