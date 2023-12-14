import Swal from 'sweetalert2';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from '../components/Cookie';

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

// 버튼 클릭 시 회원 유효성 확인이 필요한 경우
export const checkLogin = (dispatch, accessToken, isLogin, navigate) =>{
    if(!isLogin){
        Toast.fire({
            icon: 'error',
            title: '로그인 후 이용해 주세요'
        }).then(() => {
            navigate('/login');
        });  
    }else{
        axios.get(`http://localhost:8080/member`,{
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

            // 토큰이 유효하지 않은 경우 (리프레시 토큰도 만료된 경우) 재로그인 요청
           tokenExpried(dispatch, removeCookie, err.response.data, navigate);
        })
    }
}

// 토큰 재생성
export const tokenCreate = (dispatch, setCookie, headers) => {
    if (headers.authorization !== undefined) {
        console.log("헤더 들어옴");
        console.log(headers.authorization);
        console.log(headers.refresh);
        dispatch({ type: "accessToken", payload: headers.authorization });
        setCookie("refreshToken", `${headers.refresh}`);
    }
}

// 토큰 만료 처리
export const tokenExpried = (dispatch, removeCookie, data, navigate) => {
    if(data.status === 602){
        // 로컬 없애는 로직 추가
        dispatch({type:"accessToken", payload:""});
        dispatch({type:"isLogin", payload:false});
        dispatch({type:"member", payload:""});
        dispatch({type:"cafe", payload:""});

        // 로컬 스토리지 정보 및 쿠키 토큰 제거
        removeCookie("refreshToken");

        Toast.fire({
            icon: 'error',
            title: '다시 로그인 후 이용해주세요'
        }).then(()=>{
            navigate("/login");
        })
    }else{
        Toast.fire({
            icon: 'error',
            title: '관리자에게 문의해주세요'
    })}
}