import loginStyle from './loginStyle.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Toast } from '../components/Toast.js'
import { setCookie } from '../components/Cookie';
import { url } from '../config.js'

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 사용자/사장님 페이지 변경
  const [showLoginPage, setShowLoginPage] = useState(false);

  // 회원가입 후 화면 이동 결정
  const location = useLocation();

  useEffect(() => {
    const showLoginPageParam = new URLSearchParams(location.search).get('showLoginPage');
    if (showLoginPageParam === "STORE") setShowLoginPage(true);
  }, [location.search]);

  // 사용자 관련
  const [userLogin, setUserLogin] = useState({ id: '', password: '', memberType: 'USER' });
  const [validUser, setValidUser] = useState({ id: false, password: false });
  const [warningUser, setWarningUser] = useState({ id: false, password: false });

  const submitUserCheck = userLogin.id !== '' && userLogin.password !== '' && validUser.id && validUser.password && !warningUser.id && !warningUser.password;

  const handleClickUser = (e) => {
    e.preventDefault();
    setWarningUser((prevWarnings) => ({
      ...prevWarnings,
      id: userLogin.id.trim() === '',
      password: userLogin.password.trim() === ''
    }));

    if (submitUserCheck) {
      axios.post(`${url}/login`, userLogin)
        .then(res => {
          // 토큰과 회원정보 저장
          dispatch({ type: "isLogin", payload: true });
          dispatch({ type: "member", payload: res.data.member });
          dispatch({ type: "accessToken", payload: res.headers.authorization });

          // refreshtoken을 쿠키에 담아서 저장
          const refreshToken = res.headers.refresh;
          setCookie("refreshToken", refreshToken);

          Toast('success', '로그인 완료되었습니다')
          .then(()=>{
            window.location.href = "/";
          })
        })
        .catch(err => {
          const errStatus = err.response.data.status;
          // 로그인 에러
          if (errStatus === 401) {
            Toast('error', '회원이 아닙니다. 회원가입 후 이용해 주세요')
            .then(()=>{
              navigate('/signUpUser');
            })
          } else if (errStatus === 990) {
            Toast('error', '사장 회원은 사장 로그인을 이용해 주세요')
            setShowLoginPage(true);
          } else if (errStatus === 880) {
            Toast('error', '탈퇴한 회원입니다')
          } else {
            Toast('error', '로그인이 불가능합니다 관리자에게 문의해 주세요')
          }
        })
    }
  }

  const changeUserLogin = (e) => {
    const { name, value } = e.target;

    setUserLogin((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));

    setWarningUser((prevWarnings) => ({
      ...prevWarnings,
      [name]: false
    }));

    validUserCheck(name, value);
  };

  const validUserCheck = (name, value) => {
    let isValid;
    if (name === 'id') {
      isValid = inputRegexs.idRegex.test(value);
    }
    else if (name === 'password') {
      isValid = inputRegexs.passwordRegex.test(value);
    }
    setValidUser((prevChecks) => ({
      ...prevChecks,
      [name]: isValid,
    }));
  }

  // 사장님 관련
  const [storeLogin, setStoreLogin] = useState({ id: '', password: '', memberType: 'STORE' });
  const [validStore, setValidStore] = useState({ id: false, password: false });
  const [warningStore, setWarningStore] = useState({ id: false, password: false });

  const submitStoreCheck = storeLogin.id !== '' && storeLogin.password !== '' && validStore.id && validStore.password && !warningStore.id && !warningStore.password;

  const handleClickStore = (e) => {
    e.preventDefault();
    setWarningStore((prevWarnings) => ({
      ...prevWarnings,
      id: storeLogin.id.trim() === '',
      password: storeLogin.password.trim() === ''
    }));

    if (submitStoreCheck) {
      axios.post(`${url}/login`, storeLogin)
        .then(res => {
          // 토큰과 회원정보 저장
          dispatch({ type: "isLogin", payload: true });
          dispatch({ type: "member", payload: res.data.member });
          dispatch({ type: "accessToken", payload: res.headers.authorization });
          dispatch({ type: "cafe", payload: res.data.cafe });

          // refreshtoken을 쿠키에 담아서 저장
          const refreshToken = res.headers.refresh;
          console.log(res);
          console.log("토큰 확인 = " + res.headers);
          console.log("리프레시 확인 = " + refreshToken);
          setCookie("refreshToken", refreshToken);

          Toast('success', '로그인 완료되었습니다')
          .then(()=> {
            window.location.href = "/";
          })
        })
        .catch(err => {
          const errStatus = err.response.data.status;
          // 로그인 에러
          if (errStatus === 401) {
            Toast('error', '회원이 아닙니다\n회원가입 후 이용해 주세요')
            .then(() => {
              navigate('/signUpStore');
            });
          } else if (errStatus === 991) {
            Toast('error', '사용자 회원은 사용자 로그인을 이용해 주세요')
            setShowLoginPage(false);
          } else if (errStatus === 880) {
            Toast('error', '탈퇴한 회원입니다')
          } else {
            Toast('error', '로그인이 불가능합니다 관리자에게 문의해 주세요')
          }
        })
    }
  }

  const changeStoreLogin = (e) => {
    const { name, value } = e.target;

    setStoreLogin((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));

    setWarningStore((prevWarnings) => ({
      ...prevWarnings,
      [name]: false
    }));

    validStoreCheck(name, value);
  };

  const validStoreCheck = (name, value) => {
    let isValid;

    if (name === 'id') {
      isValid = inputRegexs.idRegex.test(value);
    }
    else if (name === 'password') {
      isValid = inputRegexs.passwordRegex.test(value);
    }
    setValidStore((prevChecks) => ({
      ...prevChecks,
      [name]: isValid,
    }));
  }

  const handleKakaoOauthLogin = () => {
    window.location.href = `${url}/oauth2/authorization/kakao`;
  }

  const handleNaverOauthLogin = () =>{
    window.location.href = `${url}/oauth2/authorization/naver`;
  }

  const inputRegexs = {
    idRegex: /^[a-z0-9]{5,12}$/,
    passwordRegex: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/
  };

  return (
    <div className='login-container'>
      {/* 왼쪽에 사진 */}
      <div className='login-left-section'>
        <div className='login-left-text'>
          당신이 원하던 <br />
          바로 그 카페를 찾는 곳,<br /><br />
          카페허브
        </div>
        <div className='login-left-button'>
          <button className={`store ${showLoginPage ? 'active' : ''}`}
            onClick={() => setShowLoginPage(true)}>사장님</button>
          <button className={`user ${!showLoginPage ? 'active' : ''}`}
            onClick={() => setShowLoginPage(false)}>사용자</button>
        </div>
      </div>

      {showLoginPage ? (
        <div className='login-right-section-store'>
          <div className='login-title-store'>Login</div> <br />
          <form>
            <div className='loginInputDiv'>
              <label>아이디
                <span className='login-auth'>
                  {warningStore.id ? "아이디를 입력하세요" :
                    (storeLogin.id && !validStore.id ? "5~12자로 작성하세요" : "")}
                </span><br />
                <input type="text" id="id" name="id" onChange={changeStoreLogin} /></label>
            </div>
            <br /><br />
            <div className='loginInputDiv'>
              <label> 비밀번호 <span className='login-auth'>
                {warningStore.password ? "비밀번호를 입력하세요" :
                  (storeLogin.password && !validStore.password ? "소문자/숫자/특수문자 포함 8~20자로 작성하세요" : "")}
              </span><br />
                <input type="password" id="password" name="password" onChange={changeStoreLogin} /></label>
            </div>

            <div className='login-button'>
              <button type="submit" onClick={handleClickStore}> Login </button>
            </div>
            <div className='searchInfo'><a href="/signUpStore">회원가입</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="/searchId">아이디 찾기</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="/searchPw">비밀번호 찾기</a></div>
          </form>
        </div>
      ) : (
        /* 오른쪽에 로그인 입력 폼 - 사용자 */
        <div className='login-right-section-user'>
          <div className='login-title'>Login</div><br />
          <form>
            <div className='loginInputDiv'>
              <label>아이디
                <span className='login-auth'>
                  {warningUser.id ? "아이디를 입력하세요" :
                    (userLogin.id && !validUser.id ? "5~12자로 작성하세요" : "")}
                </span><br />
                <input type="text" id="id" name="id" onChange={changeUserLogin} /> </label>
            </div>
            <br /><br />
            <div className='loginInputDiv'>
              <label> 비밀번호
                <span className='login-auth'>
                  {warningUser.password ? "비밀번호를 입력하세요" :
                    (userLogin.password && !validUser.password ? "소문자/숫자/특수문자를 포함한 8~20자로 작성하세요" : "")}
                </span><br />
                <input type="password" id="password" name="password" onChange={changeUserLogin} /></label>
            </div>
            <div className='socialLoginBtn' style={{ textAlign: "center" }}>
              <img className="kakao" src="/img/KakaoBtn.png" alt='Kakao' onClick={handleKakaoOauthLogin} />
              <img className="naver" src="/img/NaverBtn.png" alt='Naver' onClick={handleNaverOauthLogin}/>
            </div><br />
            <div className='login-button'>
              <button type="submit" onClick={handleClickUser}> Login </button>
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