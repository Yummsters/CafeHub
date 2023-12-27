import React from 'react';
import { NavLink } from 'react-router-dom';
import "./SideTabStyle.css";

const StoreSideTab = () => {
    const tabs = [
       {label:'회원 정보', link:'/storeuserInfo'},
        {label:'카페 정보', link:'/storeInfo'},
        {label:'커피콩/권한 등록', link:'/keypad'},
        {label:'카페 리뷰 조회',link:'/storeReview'},
        {label:'광고 배너 신청',link:'/storeBanner'},
        {label: '서비스 종료 신청', link: '/storeClose' }
    ];

    return (
        <div className='sideBox'>
            {tabs.map((tab, index) => (
            <NavLink
                key={index}
                to={tab.link}
                className={({isActive}) => (isActive ? 'selectTab':'tab')}>
                {tab.label}
            </NavLink>
            ))}
        </div>
    );
};

export default StoreSideTab;
