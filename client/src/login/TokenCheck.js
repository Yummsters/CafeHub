import Swal from 'sweetalert2';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from '../components/Cookie';
import { url } from '../config.js'
import { Toast } from '../components/Toast.js'

// 버튼 클릭 시 회원 유효성 확인이 필요한 경우
export const checkLogin = (dispatch, accessToken, isLogin, navigate) =>{
    return new Promise((resolve, reject) => {
        if(!isLogin){
            Toast('error', '로그인 후 이용해 주세요')
            .then(() => {
                 window.location.href="/login";
            });  
        }else{
            axios.get(`${url}/member`,{
                headers : {
                    Authorization :accessToken,
                    Refresh : getCookie("refreshToken")
                }
            })
            .then(res => {
                // 토큰이 유효한 경우 확인 후 재발급
                tokenCreate(dispatch, setCookie, res.headers);
                resolve();
            })
            .catch(err=>{
                // 토큰이 유효하지 않은 경우 (리프레시 토큰도 만료된 경우) 재로그인 요청
                tokenExpried(dispatch, removeCookie, err.response.data, navigate);
            })
        }
    });
}

// 토큰 재생성
export const tokenCreate = (dispatch, setCookie, headers) => {
    return new Promise((resolve, reject) => {
        if (headers.authorization !== undefined) {
            dispatch({ type: "accessToken", payload: headers.authorization });
            setCookie("refreshToken", `${headers.refresh}`);
            resolve();
        }else{
            resolve();
        }
    });
}

// 토큰 만료 처리
export const tokenExpried = (dispatch, removeCookie, data, navigate) => {
    if(data.status === 602){
        // 로컬 없애는 로직 추가
        dispatch({type:"accessToken", payload:""});
        dispatch({type:"isLogin", payload:false});
        dispatch({type:"member", payload:""});
        dispatch({type:"cafe", payload:""});
        dispatch({ type: "payment", payload: "" });

        // 로컬 스토리지 정보 및 쿠키 토큰 제거
        removeCookie("refreshToken");
        
        Toast('error', '다시 로그인 후 이용해 주세요')
        .then(()=>{
              window.location.href="/login";
        })
    }
}

// 일반 버튼 관련 토큰 확인 처리
export const normalCheck = (dispatch, accessToken) => {
        axios.get(`${url}/member`,{
            headers : {
                Authorization :accessToken,
                Refresh : getCookie("refreshToken")
            }
        })
        .then(res => {
            // 토큰이 유효한 경우 확인 후 재발급
            tokenCreate(dispatch, setCookie, res.headers);
        })
        .catch(err=>{
            if(err.response.data.status === 602){
                // 로컬 없애는 로직 추가
                dispatch({type:"accessToken", payload:""});
                dispatch({type:"isLogin", payload:false});
                dispatch({type:"member", payload:""});
                dispatch({type:"cafe", payload:""});
                dispatch({ type: "payment", payload: "" });
        
                // 로컬 스토리지 정보 및 쿠키 토큰 제거
                removeCookie("refreshToken");
            }
        })
}

export const checkToLogin = (dispatch, accessToken, navigate) => {
        axios.get(`${url}/member`,{
            headers : {
                Authorization :accessToken,
                Refresh : getCookie("refreshToken")
            }
        })
        .then(res => {
            // 토큰이 유효한 경우 확인 후 재발급
            tokenCreate(dispatch, setCookie, res.headers);
        })
        .catch(err=>{
            if(err.response.data.status === 602){
                // 로컬 없애는 로직 추가
                dispatch({type:"accessToken", payload:""});
                dispatch({type:"isLogin", payload:false});
                dispatch({type:"member", payload:""});
                dispatch({type:"cafe", payload:""});
                dispatch({ type: "payment", payload: "" });
        
                // 로컬 스토리지 정보 및 쿠키 토큰 제거
                removeCookie("refreshToken");

                Toast('error', '다시 로그인 해주세요')
                .then(()=>{
                    window.location.href="/login";
                })
            }
        })
}
