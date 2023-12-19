import {useEffect} from 'react';
import {useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const OAuth2Err = () => {
    const navigate = useNavigate();

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
    
    useEffect(()=>{
        Toast.fire({
            icon: 'error',
            title: '탈퇴한 회원입니다'
        }).then(() => {
            navigate('/');
        }); 
    },[])

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

export default OAuth2Err;