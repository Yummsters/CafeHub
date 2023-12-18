import {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router';
import {useDispatch} from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getCookie, removeCookie, setCookie } from '../components/Cookie';

const OAuth2 = () => {
    const dispatch = useDispatch();
    const {accessToken, refreshToken} = useParams();
    console.log(accessToken);
    console.log(refreshToken);
    const navigate = useNavigate();
    const [member, setMember] = useState({memNo:'', name : '', nickname : '', email:'', social : '', status : true, memberType:''});

    setCookie("refreshToken", refreshToken);
    dispatch({type:"accessToken", payload:accessToken});
    dispatch({type:"isLogin", payload:true});

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

    useEffect(()=> {
        axios.get(`http://localhost:8080/member`,{
            headers : {
                Authorization :accessToken,
                Refresh : getCookie("refreshToken")
            }
        })
        .then(res=>{
            console.log(res);
            setMember(res.data);
            dispatch({type:"member", payload:res.data});
            Toast.fire({
                icon: 'success',
                title: '로그인이 완료되었습니다.'
            }).then(() => {
                window.location.href="/";
            }); 
        })
        .catch(err =>{
            console.log(err);
            const errStatus = err.response.data.status;
            // 로그인 에러
        if(errStatus === 401){
            Toast.fire({
              icon: 'error',
              title: '회원이 아닙니다. 회원가입 후 이용해 주세요'
          })
          navigate('/signUpUser');
          } else if(errStatus === 880){
            Toast.fire({
              icon: 'error',
              title: '탈퇴한 회원입니다'
          })}else{
            Toast.fire({
              icon: 'error',
              title: '로그인이 불가능합니다 관리자에게 문의해 주세요'
          })}
        })
    }, [])

    return (
        <div className='login-container'>
          {/* 왼쪽에 사진 */}
          <div className='login-left-section'>
           <div className='login-left-text'>
            당신이 원하던 <br/>
            바로 그 카페를 찾는 곳,<br/><br/>
            카페허브
           </div>
           <div className='login-left-button'>
            <button className={`store`} >사장님</button>
            <button className={`user ${'active'}`}>사용자</button>
           </div>
          </div>
        <div className='login-right-section-user'>
        <div className='login-title'>Login</div><br/>
        <form>
        <div className='loginInputDiv'>
            <label>아이디 
              <span className='login-auth'>
                  
                </span><br/>
            <input type="text" id="id" name="id"/> </label>
        </div>
          <br/><br/>
        <div className='loginInputDiv'>
          <label> 비밀번호
            <span className='login-auth'>
             
            </span><br/>
          <input type="password" id="password" name="password"/></label>
        </div>
        <div className='socialLoginBtn' style={{textAlign:"center"}}>
            <img className="kakao" src="/img/KakaoBtn.png" alt='Kakao'/>
            <img className="naver" src="/img/NaverBtn.png" alt='Naver'/>
        </div><br/>
        <div className='login-button'>
            <button type="submit"> Login </button>
        </div>
        <div className='searchInfo'><a href="/signUpUser">회원가입</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="searchId">아이디 찾기</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="searchPw">비밀번호 찾기</a></div>
        </form>
        </div>
        </div>
    )
}

export default OAuth2;