import React from 'react';
import "./footerStyle.css";

const Footer = () => {
    return (
        <div className='footerBox'>
            <div className='footerContent'>
                <div className='logo'>Cafe<span className="hub">Hub</span></div>
                <div className='footer_info'>
                    <p>상호명 및 서비스 제공 : (주)카페허브</p>
                    <p>대표이사 : 김희진, 서혜리, 조수빈, 허선진</p>
                    <p>주소 : 서울시 금천구 가산디지털 1로 70</p>
                    <p>사업자등록번호 : 2023-1129-1229</p>
                    <p><a href = "https://github.com/Yummsters/CafeHub">Github</a></p>
                </div>
            </div>
        </div>
    );
};

export default Footer;