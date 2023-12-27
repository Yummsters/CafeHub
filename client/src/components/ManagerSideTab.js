import React from 'react';
import "./SideTabStyle.css";
import { NavLink } from 'react-router-dom';

const SideTab = () => {
    const tabs = [
        {label:'광고 신청 현황', link:'/managerAd'},
        {label:'카페 포인트 정산',link:'/managerPoint'},
        {label:'등록 카페 결제 확인',link:'/managerConfirm'}
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

export default SideTab;