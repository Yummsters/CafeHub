import React, { useEffect, useState } from 'react';
import './headerStyle.css';
import axios from 'axios';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import {persistor} from '../App';
import { getCookie, removeCookie, setCookie } from './Cookie';
import Swal from 'sweetalert2';


const Header = () => {
    const memberType = useSelector(state=>state.persistedReducer.member.memberType);
    const memNo = useSelector(state=>state.persistedReducer.member.memNo);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const isLogin = useSelector(state=>state.persistedReducer.isLogin);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    
    // swal
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    // 마이페이지
    const mypage = (e) =>{
        e.preventDefault();

        axios.get(`http://localhost:8080/member`,{
            headers : {
                Authorization : accessToken
            }
        })
        .then(res=>{
            console.log(res);
            navigate("/");
        })
        .catch(err =>{
            console.log(err);
        })

        if(!isLogin){
            Toast.fire({
                icon: 'error',
                title: '로그인을 이용해 주세요'
            })
            setTimeout(() => {
                navigate('/login');
            }, 800);  
        }else{
            console.log(memNo);
            axios.get(`http://localhost:8080/member/${memNo}`,{
                headers : {
                    Authorization :accessToken,
                }
            })
            .then(res => {
                // 토큰이 유효한지 확인하고 유효하다면
                navigate('/userInfo');
            })
            .catch(err=>{
                console.log(err.data);
                console.log(err);
                if(err.response.data.status === 401){
                    // accessToken
                    removeCookie("accessToken");
                    dispatch({type:"isLogin", payload:false});
                    dispatch({type:"member", payload:''});
                    Toast.fire({
                        icon: 'error',
                        title: '로그인 후 이용해주세요.'
                    });
                }else if(err.response.data.status === 403){
                    Toast.fire({
                    icon: 'error',
                    title: '이용 불가능한 회원입니다.'
                })
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: '관리자에게 문의해주세요'
                })
                }
            })
        }
    }

    // 로그아웃
    const logout = (e) =>{
        e.preventDefault();

        // 로컬 스토리지 정보 및 쿠키 토큰 제거
        dispatch({type:"isLogin", payload:false});
        dispatch({type:"member", payload:''});
        dispatch({type:"accessToken", payload:''});
        removeCookie("refreshToken");

        persistor.purge();

        Toast.fire({
                icon: 'success',
                title: '로그아웃 되었습니다',
        }).then(()=>{
            navigate("/login");
        })
    }

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

                {/* 추후 토큰 시간 관련하여 추가 설정 필요 */}
                    <p>{ memberType==="MANAGER" ? <a href="/managerAd"> 관리자 마이페이지 </a>: 
                    (memberType === "STORE" ? <a href="/storeInfo">내 가게 관리</a> : 
                    <a href= "#" onClick={mypage}>마이페이지</a>)}</p>

                    <p> {!isLogin ? <a href="/login">로그인</a> : <a href="#" onClick={logout}>로그아웃</a>}</p>
                </div>
            </div>
        </div>
    );
};

export default Header;