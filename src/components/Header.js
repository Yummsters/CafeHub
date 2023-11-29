import React from 'react';
import './headerStyle.css';

const Header = () => {
    return (
        <div className='navBox'>
            <div className='navContent'>
                <a href="/" style={{textDecoration:"none"}}><div className='logo'>Café<span className="hub">Hub</span></div></a>
                <div className='center'>
                    <p>카페 추천</p>
                    <p><a href="/ReviewList">리뷰 게시판</a></p>
                    <p><a href="/Map">내 근처 카페</a></p>
                </div>
                <div className='right'>
                    <p><a href="/userInfo">마이페이지</a></p>
                    <p><a href="/login">로그인</a></p>
                </div>
            </div>
        </div>
    );
};

export default Header;