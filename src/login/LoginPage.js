import { useState} from 'react';
import loginStyle from './loginStyle.css';

const LoginPage = () =>{
    const [login, setLogin] = useState({id:'', password:''});
    const [showLoginPage, setShowLoginPage] = useState(false);

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
            <button className={`store ${showLoginPage ? 'active' : ''}`}
            onClick={()=>setShowLoginPage(true)}>사장님</button>
            <button className={`user ${!showLoginPage ? 'active' : ''}`}
            onClick={()=>setShowLoginPage(false)}>사용자</button>
           </div>
          </div>
    
            {showLoginPage ?(
            <div className='login-right-section-store'>
            <div className='login-title-store'>Login</div> <br/>
            <form>
            <div className='loginInputDiv'>
                <label>아이디 <span className='login-authId'>5~12자로 작성하세요.</span><br/>
                <input type="text" id="id" name="id" /></label>
            </div>
              <br/><br/>
            <div className='loginInputDiv'>
              <label> 비밀번호 <span className='login-authPw'> 소문자/숫자/특수문자를 포함하여 작성하세요.</span><br/>
              <input type="password" id="password" name="password"/></label>
            </div>
            
            <div className='login-button'>
                <button type="submit" > Login </button>
            </div>
            <div className='searchInfo'><a href="/signUpStore">회원가입</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="/searchId">아이디 찾기</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="/searchPw">비밀번호 찾기</a></div>
            </form>
            </div>
        ) :(
          /* 오른쪽에 로그인 입력 폼 - 사용자 */
        <div className='login-right-section-user'>
          <div className='login-title'>Login</div><br/>
          <form>
          <div className='loginInputDiv'>
              <label>아이디 <span className='login-authId'>5~12자로 작성하세요.</span><br/>
              <input type="text" id="id" name="id" /> </label>
          </div>
            <br/><br/>
          <div className='loginInputDiv'>
            <label> 비밀번호 <span className='login-authPw'> 소문자/숫자/특수문자를 포함하여 작성하세요.</span><br/>
            <input type="password" id="password" name="password"/></label>
          </div>
          <div className='socialLoginBtn' style={{textAlign:"center"}}>
              <img className='google' src="/img/GoogleBtn.png" alt='Google'/>
              <img className="kakao" src="/img/KakaoBtn.png" alt='Kakao'/>
              <img className="naver" src="/img/NaverBtn.png" alt='Naver'/>
          </div><br/>
          <div className='login-button'>
              <button type="submit" > Login </button>
          </div>
          <div className='searchInfo'><a href="/signUpUser">회원가입</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="searchId">아이디 찾기</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="searchPw">비밀번호 찾기</a></div>
          </form>
          </div>
      ) 
      }
    </div>
    );
}


export default LoginPage;