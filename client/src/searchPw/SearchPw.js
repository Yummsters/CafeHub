import axios from "axios";
import searchPw from "./searchPwStyle.css";
import { useState } from "react";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router";

const SearchPw = () => { // 휴대폰 인증과 인증번호 일치 확인 후 폼 제출하여 id,phone 일치 확인
  const [data, setData] = useState({});
  const [valid, setValid] = useState({ id: false, phone: false });
  const [warnings, setWarnings] = useState({
    id: false,
    phone: false,
    phoneConfirm: false,
  });
  const [randomCode, setRandomCode] = useState(0);
  const navigate = useNavigate();

  // swal
  const toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 1500,
  });

  // input 값 저장
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // 휴대폰 번호 인증
  const sendPhoneCode = () => {
    const random = Math.floor(Math.random() * 9000) + 1000;
    setRandomCode(random);
    console.log("Random code set:", random);
    console.log(data.phone);
    // axios.get(`http://localhost:8080/check/sendSMS?phone=${data.phone}&code=${randomCode}`)
    // .then((res) => {
    //     console.log(res.data);
    //     toast.fire({
    //         title: '인증번호가 발송되었습니다',
    //         icon: 'success',
    //     });
    // })
    // .catch((error) => {
    //     console.log(error);
    // });
  };

  // 인증번호 일치여부
  const phoneCodeCheck = () => {
    if (data.authNum == randomCode) {
      toast.fire({
        title: "휴대폰 번호 인증 성공!",
        icon: "success",
      });
    } else {
      toast.fire({
        title: "인증번호가 틀렸습니다",
        text: "확인 후 다시 입력해주세요",
        icon: "error",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8080/searchPw", {
          id: data.id,
          phone: data.phone,
      })
      .then((res) => {
        console.log(res.data + "ok");
        navigate("/searchPwResult", { state: { result: res.data } });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "회원정보가 일치하지 않습니다",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  return (
    <div className="searchPw-container">
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
              <span className="searchPw-AuthPhone">
                휴대폰 번호를 확인해주세요</span><br />
              <input type="text" id="phone" name="phone" onChange={handleChange}/>
            </label>
          </div>
          <div className="searchPwAuthNum">
            <button type="button" onClick={sendPhoneCode}>휴대폰 <br />인증</button>
          </div>
          <br />
          <div className="searchPwInputDiv-phone">
            <label>인증번호
              <span className="searchPw-Auth">인증번호를 확인해주세요</span><br />
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
  );
};

export default SearchPw;
