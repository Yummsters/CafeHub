import React from 'react';
import "./SideTabStyle.css"
import { NavLink } from 'react-router-dom';

const UserSideTab = () => {
    const tabs = [
       {label:'회원 정보', link:'/userInfo'},
       {label: '찜한 카페', link:'/WishStore'},
       {label:'찜한 리뷰', link:'/wishReview'},
       {label:'리뷰 관리' , link:'/myReivew'},
       {label:'댓글 관리', link:'/myReply'},
       {label:'커피콩 관리', link:'/userPoint'}
    ];

    return (
        <div className='sideBox'>
        {tabs.map((tab, index) => (
            <NavLink
                key={index}
                to={tab.link}
                className={({isActive}) => (isActive ? 'selectTab':'tab')} >
                {tab.label}
            </NavLink>
        ))}
    </div>

    );
};

export default UserSideTab;