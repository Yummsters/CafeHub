import Swal from 'sweetalert2';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from '../components/Cookie';
import { url } from '../config.js'

 // swal
 const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 800,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

// 버튼 클릭 시 회원 유효성 확인이 필요한 경우
export const checkLogin = (dispatch, accessToken, isLogin, navigate) =>{
    return new Promise((resolve, reject) => {
        if(!isLogin){
            Toast.fire({
                icon: 'error',
                title: '로그인 후 이용해 주세요'
            }).then(() => {
                navigate('/login');
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
                console.log(err);
                // 토큰이 유효하지 않은 경우 (리프레시 토큰도 만료된 경우) 재로그인 요청
                tokenExpried(dispatch, removeCookie, err.response.data, navigate);
            })
        }
    });
}

// 토큰 재생성
export const tokenCreate = (dispatch, setCookie, headers) => {
    console.log("에세스 토큰 만료 확인중 ");
    return new Promise((resolve, reject) => {
        if (headers.authorization !== undefined) {
            console.log("에세스 토큰 만료 확인 - 토큰 재생성")
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
    console.log("리스레스 토큰 만료 확인중 ");

    if(data.status === 602){
        console.log("리프레시 토큰 만료 - 로그아웃");
        // 로컬 없애는 로직 추가
        dispatch({type:"accessToken", payload:""});
        dispatch({type:"isLogin", payload:false});
        dispatch({type:"member", payload:""});
        dispatch({type:"cafe", payload:""});
        dispatch({ type: "payment", payload: "" });

        // 로컬 스토리지 정보 및 쿠키 토큰 제거
        removeCookie("refreshToken");
        console.log("리덕스 삭제")

        
        Toast.fire({
            icon: 'error',
            title: '다시 로그인 후 이용해주세요'
        })
        setTimeout(() => {
            console.log("로그인 페이지로 이동");
            navigate("/login");
        }, 700);
        console.log("끝")
    }
}

// 일반 버튼 관련 토큰 확인 처리
export const normalCheck = (dispatch, accessToken) => {
    console.log("토큰 유효성 확인 중")
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
            console.log(err); 
            console.log("리프레시 토큰 만료 - 로그아웃");

            if(err.response.data.status === 602){
                console.log("들어옴");
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