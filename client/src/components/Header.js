import React from 'react';
import './headerStyle.css';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

const Header = () => {
    const memberType = useSelector(state=>state.persistedReducer.member.memberType);
    const token = useSelector(state => state.persistedReducer.token);

    return (
        <div className='navBox'>
            <div className='navContent'>
                <a href="/" style={{textDecoration:"none"}}><div className='logo'>Café<span className="hub">Hub</span></div></a>
                <div className='center'>
                    <p>카페 추천</p>
                    <p><a href="/reviewList">리뷰 게시판</a></p>
                    <p><a href="/map">내 근처 카페</a></p>
                </div>
                <div className='right'>
                    <p>{ memberType==="MANAGER" ? <a href="/managerAd"> 관리자 마이페이지 </a>: (memberType === "STORE" ? <a href="/storeInfo">내 가게 관리</a> : <a href="/userInfo">마이페이지</a>)}</p>                    
                    <p> {token.length===0 ? <a href="/login">로그인</a> : <a href="/logout">로그아웃</a>}</p>
                </div>
            </div>
        </div>
    );
};

export default Header;