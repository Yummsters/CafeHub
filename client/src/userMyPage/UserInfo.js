import React, { useEffect, useState } from 'react';
import './UserInfoStyle.css';
import UserSideTab from '../components/UserSideTab';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router';
import { removeCookie} from '../components/Cookie';
import Swal from 'sweetalert2';


const UserInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const member = useSelector(state=>state.persistedReducer.member);
  const social = useSelector(state=>state.persistedReducer.member.social);
  const accessToken = useSelector(state => state.persistedReducer.accessToken);
  const [updateUser, setUpdateUser] = useState({ ...member }) // 로그인 멤버 정보 복제
  const [randomCodeMatch, setRandomCodeMatch] = useState(false);
  
  const [pwInput, setPwInput] = useState('');
  const [pwMatch, setPwMatch] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [emailMatch, setEmailMatch] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [withdrawalConfirmed, setWithdrawalConfirmed] = useState(false);
  
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

  // 수정 관련---------------------------------------
  const edit = () => { // 수정버튼 클릭 시 input 입력 가능
    setEditMode(true);
  }
  const save = () => { // 저장버튼 클릭 시 input readOnly
    axios.put("http://localhost:8080/member/modifyInfo", updateUser)
    .then((res) => {
      console.log(res.data);
      dispatch({type:"member", payload: updateUser}); // redux 상태 업데이트
      setEditMode(false);
    })
    .catch((error) => {
      console.log(error);
    })
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser({ ...updateUser, [name]: value });
    if (name === 'phone') {
      setRandomCodeMatch(false); // 휴대폰 입력값 바뀌면 false
    }
  }

  // 수정 - 휴대폰 인증
  const sendPhoneCode = () => {
    // 랜덤 코드
    const random = Math.floor(Math.random() * 9000) + 1000;
    console.log("Random code set:", random);
    console.log(updateUser.phone);
    // 입력한 번호로 랜덤 코드 발송
    // axios.get(`http://localhost:8080/check/sendSMS?phone=${updateUser.phone}&code=${random}`)
    // .then((res) => {
    //     console.log(res.data);
        // swal로 인증번호 입력 받고 확인
        Swal.fire({
          title: "인증번호 확인",
          text: "입력한 번호로 전송된 인증번호를 입력하세요",
          input: "text",
        showCancelButton: true,
        confirmButtonText: "ok",
        preConfirm: (inputCode) => {
          if (inputCode === random.toString()) {
            return true; // 인증 성공
          } else {
            Swal.showValidationMessage("인증번호가 일치하지 않습니다.");
            return false; // 인증 실패
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          Toast.fire({
            title: "휴대폰 번호 인증 완료",
            icon: "success"
          });
          setRandomCodeMatch(true);
        }
      });
      // })
      // .catch((error) => {
        //     console.log(error);
        // });
      }
      
  // 비밀번호 관련---------------------------------------
  const [password, setPassword] = useState({pw:'', newPw:'', newPwCheck:''});
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({pw:'', newPw:'', newPwCheck:''});

  const handlePassword = (e) => { // input 입력 값 저장 
    const { name, value } = e.target;
    setPassword((prevPassword) => {
      const updatedPassword = { ...prevPassword, [name]: value };
      
      // 새 비밀번호 유효성
      if (name === 'newPw' && !/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/.test(value) && value.trim() !== '') {
        setPasswordMsg((prevMsg) => ({ ...prevMsg, [name]: '소문자/숫자/특수문자 포함 8~20자' }));
      } else {
        setPasswordMsg((prevMsg) => ({ ...prevMsg, [name]: '' }));
      }
      // 새 비밀번호 일치 여부
      if (name === 'newPwCheck') {
        setPasswordMsg((prevMsg) => ({ ...prevMsg, [name]: value !== updatedPassword.newPw ? '비밀번호가 일치하지 않습니다' : '' }));
      }

      return updatedPassword;
    });
  };

  // 현재 비밀번호 확인
  useEffect(() => { 
    if (password.pw !== '') {
      axios.post("http://localhost:8080/member/password", {id: member.id, password: password.pw}, 
          {
            headers : {
              Authorization :accessToken,
              'Content-Type': 'application/json'
          }
      })
      .then((res) => {
        console.log(res.data);
        if(res.data === true) {
          setPasswordMatch(true);
        } else {
          setPasswordMatch(false);
        }
      })
      .catch((error) => {
        console.log(error);
      })
    };
  }, [password.pw])

  const pwSubmit = () => {
      if (passwordMsg.newPw !== '' || passwordMsg.newPwCheck !== '') {
        Toast.fire({
          icon: 'error',
          title: '유효하지 않은 비밀번호가 있습니다',
        });
        return; 
      }
      // 모든 필드에 값이 입력되지 않은 경우
      if (!password.newPw || !password.newPwCheck || !password.pw) {
        Toast.fire({
          icon: 'error',
          title: '비밀번호를 입력해주세요',
        });
        return; 
      }

      if (password.pw === password.newPw) {
        Toast.fire({
          icon: 'error',
          title: '현재 비밀번호와 새 비밀번호가 동일합니다',
        });
        return;
      }

    axios.put(`http://localhost:8080/resetPw/${member.id}`, { password: password.newPw })
        .then((res) => {
            console.log(res);
            Toast.fire({
                title: "비밀번호 재설정 완료!",
                icon: "success",
            });
        })
        .catch((error) => {
            console.log(error);
            Toast.fire({
              title: "비밀번호 재설정 실패",
              icon: "error",
          });
        })
    setPassword({ pw: '', newPw: '', newPwCheck: '' }); // 제출 후 필드 초기화
    setPasswordMatch(false);
  }

  // 모달 관련---------------------------------------
  const openWithdrawalModal = () => {
    setIsWithdrawalModalOpen(true);
    setPwInput('');
    setPwMatch(true);
    setWithdrawalConfirmed(false);
  };

  const closeWithdrawalModal = () => {
    setIsWithdrawalModalOpen(false);
  };

  const handleWithdrawal = (e) => {    
    // 자체 로그인 회원 탈퇴
    axios.post(`http://localhost:8080/member/delete/normal/${member.memNo}`,{
      password : pwInput
    },
    {
      headers : {
        Authorization :accessToken,
        'Content-Type': 'application/json'
      }
    })
    .then(res=>{
      console.log(res.data);
      const isPwCorrect =res.data;

      if (isPwCorrect) {
        removeCookie("refreshToken");
        dispatch({type:"isLogin", payload:false});
        dispatch({type:"accessToken", payload:""});
        dispatch({type:"member", payload:''});
        Toast.fire({
          icon: 'success',
          title: '회원탈퇴가 완료되었습니다'
        }).then(()=>{
          navigate("/");
      })
      } else {
        // 비밀번호가 일치하지 않을 때
        setPwMatch(false);
      }
    })
    .catch(err=>{
      console.log(err);
      console.log(err.data);
    })
  };

  const handleSocialWithdrawal = (e) => {    
    // 소셜 로그인 회원 탈퇴
    axios.post(`http://localhost:8080/member/delete/social/${member.memNo}`,{
      email : emailInput
    },
    {
      headers : {
        Authorization :accessToken,
        'Content-Type': 'application/json'
      }
    })
    .then(res=>{
      console.log(res.data);
      const isEmailCorrect =res.data;

      if (isEmailCorrect) {
        removeCookie("accessToken");
        dispatch({type:"isLogin", payload:false});
        dispatch({type:"member", payload:''});
        Toast.fire({
          icon: 'success',
          title: '회원탈퇴가 완료되었습니다'
        }).then(()=>{
          navigate("/");
      })
      } else {
        // 비밀번호가 일치하지 않을 때
        setEmailMatch(false);
      }
    })
    .catch(err=>{
      console.log(err);
      console.log(err.data);
    })
  };

  return (
    <div className='mypage'>
      <UserSideTab />
      <div className='userInfoBox'>
        <div className='nicknameBox'>
          <p><img src="/img/house.png" alt="house" />{member.nickname} 님</p>
        </div>
        <div className='infoBox'>
          <div className='infoTitle'>
            <p>회원정보</p>
            {editMode ? (
              <p><span onClick={save}>저장</span></p>
              ) : (
              <p><span onClick={edit}>수정</span></p>
            )}
          </div>
          <div className='infoContent' style={{ flexDirection: "column", alignItems: "stretch" }}>
            <div>
              <p>아이디</p>
              <input type="text" name="id" value={updateUser.id} readOnly={!editMode} className="inputN" />
              <span></span>
            </div>
            <div>
              <p>이름</p>
              <input type="text" name="name" value={updateUser.name} readOnly={!editMode} onChange={inputChange} className={editMode ? 'inputB' : 'inputN'} />
              <span></span>
            </div>
            <div>
              <p>이메일</p>
              <input type="text" name="email" value={updateUser.email} readOnly={!editMode} onChange={inputChange} className={editMode ? 'inputB' : 'inputN'} />
              <span>이메일유효성 / 중복확인</span>
            </div>
            <div>
              <p>닉네임</p>
              <input type="text" name="nickname" value={updateUser.nickname} readOnly={!editMode} onChange={inputChange} className={editMode ? 'inputB' : 'inputN'} />
              <span>닉네임유효성 / 중복확인</span>
            </div>
            <div>
              <p>전화번호</p>
              <input type="text" name="phone" value={updateUser.phone} readOnly={!editMode} onChange={inputChange} className={editMode ? 'inputB' : 'inputN'} />
              <span>      
                <button onClick={sendPhoneCode} disabled={randomCodeMatch}>
                  {randomCodeMatch ? "인증 완료" : "휴대폰 인증"}
                </button>
                전화번호 유효성</span>
            </div>
          </div>
        </div>
        
        <div className='pwBox'>
                <div className='pwTitle'>
                    <p>비밀번호 수정</p>
                    <span onClick={pwSubmit}>저장</span>
                </div>
                <div className='pwContent'>
                    <div>
                        <p>현재 비밀번호</p>
                        <input type="password" name="pw" value={password.pw} onInput={handlePassword} />
                        <span className='userInfoMsg'>{passwordMatch ? "" : password.pw.trim() === "" ? "" : "현재 비밀번호와 일치하지 않습니다"} </span>
                    </div>
                    {passwordMatch && (
                    <>
                      <div>
                          <p>새 비밀번호</p>
                          <input type="password" name="newPw" value={password.newPw} onInput={handlePassword} />
                          <span className='userInfoMsg'>{passwordMsg.newPw}</span>
                      </div>
                      <div>
                          <p>새 비밀번호 확인</p>
                          <input type="password" name="newPwCheck" value={password.newPwCheck} onInput={handlePassword} />
                          <span className='userInfoMsg'>{passwordMsg.newPwCheck}</span>
                      </div>
                    </>
                    )}
                </div>
            </div>
            <div className='resign'  onClick={openWithdrawalModal}>탈퇴</div>

            


        {/* 탈퇴 모달 */}
        {isWithdrawalModalOpen && (
          <div className="modal-overlay" onClick={openWithdrawalModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>

              <p>정말 탈퇴를 하시겠습니까?</p>
              <p>탈퇴할 경우, 작성한 리뷰와 댓글은 삭제되지 않습니다.</p>
              <p>회원 정보는 삭제되고, 보유한 커피콩은 소멸됩니다.</p><br />
             
              { /* 자체 로그인 사용자 탈퇴 */
              social==="NORMAL" ? 
               <><div className='checkPw'>
                  <label> <span className='checkPw-text'> 비밀번호 확인</span>
                  <input
                    type="password"
                    value={pwInput}
                    onChange={(e) => setPwInput(e.target.value)}
                  /></label>
                </div>
                {!pwMatch ? <p className="error-message">잘못된 비밀번호입니다.</p> : <p className='error-message-blank'> &nbsp; </p>}

                <div className="buttonContainer">
                  <button className='cancelBtn' onClick={closeWithdrawalModal}>취소</button>
                  <button className='withdrawBtn' onClick={handleWithdrawal}>탈퇴 신청</button>
                  </div>
                </>
              :/* 소셜 로그인 사용자 탈퇴 */
              <><div className='checkPw'>
                  <label> <span className='checkPw-text'> 이메일 확인</span>
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  /></label>
                </div>
                {!emailMatch ? <p className="error-message">잘못된 이메일입니다.</p> : <p className='error-message-blank'> &nbsp; </p>}

                <div className="buttonContainer">
                  <button className='cancelBtn' onClick={closeWithdrawalModal}>취소</button>
                  <button className='withdrawBtn' onClick={handleSocialWithdrawal}>탈퇴 신청</button>
                  </div>
                </>
            }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserInfo;