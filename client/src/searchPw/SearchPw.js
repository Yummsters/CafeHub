import axios from "axios";
import searchPw from "./searchPwStyle.css";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { url } from '../config.js'
import { Toast } from '../components/Toast.js'

const SearchPw = () => {
  const [data, setData] = useState({});
  const [warnings, setWarnings] = useState('');
  const [randomCode, setRandomCode] = useState(0);
  const [phoneAuth, setPhoneAuth] = useState(false); // 인증번호 발송 여부
  const [phoneCheck, setPhoneCheck] = useState(false); // 인증번호 일치 여부
  const navigate = useNavigate();

  // input 값 저장
  const handleChange = (e) => {
    const { name, value } = e.target;
      if (name === 'phone' && !/^[0-9]+$/.test(value) && value.trim() !== '') {
        setWarnings('하이픈(-) 없이 작성하세요');
      } else {
        setWarnings('');
      }
    setData({ ...data, [name]: value });
  };

  // 회원 정보 확인 후 휴대폰 인증번호 발송
  const sendPhoneCode = (e) => {
    e.preventDefault();
    if (!data.id || !data.phone) {
      Toast('error', '회원 정보를 입력해주세요')
      return;
    }
    axios.post(`${url}/searchPw`, { id: data.id, phone: data.phone })
    .then((res) => {
        if (res.data === true){ // 회원정보 일치하는 경우 휴대폰 인증번호 발송
          const random = Math.floor(Math.random() * 9000) + 1000;
          setRandomCode(random);
          console.log(random); // 실제 사용 시 제거
          // axios.get(`${url}/check/sendSMS?phone=${data.phone}&code=${random}`)
          // .then((res) => {
            Toast('success', '인증번호가 발송되었습니다')
              setPhoneAuth(true);
          // })
        } else {
          Toast('error', '일치하는 회원 정보가 없습니다')
        }
    })
    .catch((error) => {
      Toast('error', error.response.data)
    });
  };

  // 인증번호 일치여부
  const phoneCodeCheck = () => {
    if (data.authNum == randomCode) {
      Toast('success', '휴대폰 번호 인증 완료되었습니다')
      setPhoneCheck(true);
    } else {
      Toast('error', '인증번호가 일치하지 않습니다')
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phoneAuth || (!phoneAuth && !phoneCheck)) {
      Toast('error', '휴대폰 인증이 필요합니다')
      return;
    }
  
    if (phoneAuth && !phoneCheck) {
      Toast('error', '인증번호를 확인해주세요')
      return;
    }
    
    Toast('success', '인증 되었습니다\n비밀번호 재설정 페이지로 이동합니다')

    setTimeout(() => {
      navigate("/searchPwResult", { state: { result: data.id } });
    }, 1500);
  };

  return (
    <div className="searchPw-container">
      <div className='searchPw-bg'>
      <div className="searchPw-section">
        <div className="searchPw-title">비밀번호 찾기</div> <br />
        <form>
          <div className="searchPwInputDiv">
            <label>아이디<br />
              <input type="text" id="id" name="id" onChange={handleChange} />
            </label>
          </div>
          <br />
          <div className="searchPwInputDiv-phone">
            <label>휴대폰 번호
              <span className="searchPw-AuthPhone">{warnings}</span><br />
              <input type="text" id="phone" name="phone" onChange={handleChange}/>
            </label>
          </div>
          <div className="searchPwAuthNum">
            <button type="button" onClick={sendPhoneCode}>휴대폰 <br />인증</button>
          </div>
          <br />
          <div className="searchPwInputDiv-phone">
            <label>인증번호
              <input type="text" id="authNum" name="authNum" onChange={handleChange} />
            </label>
          </div>
          <div className="searchPwAuthNum">
            <button type="button" onClick={phoneCodeCheck}>확인</button>
          </div>
          <div className="searchPw-button">
            <button type="button" onClick={handleSubmit}>확인</button>
          </div>
          <div className='searchInfo'> <a href="/login">회원가입/로그인</a> &nbsp;&nbsp; | &nbsp;&nbsp; <a href="/searchId">아이디 찾기</a></div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default SearchPw;
