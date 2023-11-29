import React, { useState } from 'react';
import '../userMyPage/UserInfoStyle.css';
import StoreSideTab from '../components/StoreSideTab';

const StoreUserInfo = () => {

  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwMatch, setPwMatch] = useState(true);
  const [withdrawalConfirmed, setWithdrawalConfirmed] = useState(false);
  const [social, setSocial] = useState(true);
  const [userInfo, setUserInfo] = useState({id:'sooba', name:'조수빈', email:'soobin@babo.com', nickname:'sooba', pw:'', newPw:''});
  const [editMode, setEditMode] = useState(false);

  const checkPw = () => {
    // 실제로는 서버에서 비밀번호를 확인하기
    const userPw = 'user1234'; // 사용자의 실제 비밀번호
    return pwInput === userPw;
  }

  const openWithdrawalModal = () => {
    setIsWithdrawalModalOpen(true);
    setPwInput('');
    setPwMatch(true);
    setWithdrawalConfirmed(false);
  };

  const closeWithdrawalModal = () => {
    setIsWithdrawalModalOpen(false);
  };

  const handleWithdrawal = () => {
    // 비밀번호 확인 로직
    const isPwCorrect = checkPw(); // 이 함수는 비밀번호 일치 여부를 반환하는 함수입니다.

    if (isPwCorrect) {
      // 탈퇴 처리 로직
      setWithdrawalConfirmed(true);
      // 여기에서 실제 탈퇴를 수행하거나 API 호출 등 수행
    } else {
      // 비밀번호가 일치하지 않을 때
      setPwMatch(false);
    }
  };

  const edit = () => { // 수정버튼 클릭 시 input 입력 가능
    setEditMode(!editMode);
  }

  const save = () => { // 저장버튼 클릭 시 input readOnly
    setEditMode(false);
  };


  const inputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  }


  return (
    <div className='mypage'>
      <StoreSideTab />
      <div className='userInfoBox'>
        <div className='nicknameBox'>
          <p><img src="/img/house.png" alt="house" />조수빈 바보 님</p>
        </div>
        <div className='infoBox'>
          <div className='infoTitle'>
            <p>회원정보</p>
            {editMode ? (
              <p>
                <span onClick={save}>저장</span>
              </p>
            ) : (
              <p>
                <span onClick={edit}>수정</span>
              </p>
            )}
          </div>
          <div className='infoContent' style={{ flexDirection: "column", alignItems: "stretch" }}>
            <div>
              <p>아이디</p>
              <input type="text" name="id" value={userInfo.id} readOnly={!editMode} className="inputN" />
              <span></span>
            </div>
            <div>
              <p>이름</p>
              <input type="text" name="name" value={userInfo.name} readOnly={!editMode} onChange={inputChange} className={editMode ? 'inputB' : 'inputN'} />
              <span>이름유효성 넣을 부분</span>
            </div>
            <div>
              <p>이메일</p>
              <input type="text" name="email" value={userInfo.email} readOnly={!editMode} onChange={inputChange} className={editMode ? 'inputB' : 'inputN'} />
              <span>이메일유효성 넣을 부분</span>

            </div>
            <div>
              <p>닉네임</p>
              <input type="text" name="nickname" value={userInfo.nickname} readOnly={!editMode} onChange={inputChange} className={editMode ? 'inputB' : 'inputN'} />
              <span>닉네임유효성 넣을 부분</span>
            </div>
            <div>
              <p>전화번호</p>
              <input type="text" name="phone" value={userInfo.phone} readOnly={!editMode} onChange={inputChange} className={editMode ? 'inputB' : 'inputN'} />
              <span></span>
            </div>
          </div>
        </div>
        
        <div className='pwBox'>
                <div className='pwTitle'>
                    <p>비밀번호 수정</p>
                    <span onClick={save}>저장</span>
                </div>
                <div className='pwContent'>
                    <div>
                        <p>현재 비밀번호</p>
                        <input type="password" name="pw" value={userInfo.pw} onChange={inputChange} />
                        <span>비밀번호 유효성 넣을 부분</span>
                    </div>
                    <div>
                        <p>변경할 비밀번호</p>
                        <input type="password" name="newPw" value={userInfo.newPw} onChange={inputChange} />
                        <span>비밀번호 유효성 넣을 부분</span>
                    </div>
                </div>
            </div>
            <div className='resign'  onClick={openWithdrawalModal}>탈퇴</div>

            


        {/* 탈퇴 모달 */}
        {isWithdrawalModalOpen && (
          <div className="modal-overlay" onClick={openWithdrawalModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <img className="close-button" onClick={closeWithdrawalModal} src='/img/X.png' />

              <p>정말 탈퇴를 하시겠습니까?</p>
              <p>탈퇴할 경우, 작성한 리뷰와 댓글은 삭제되지 않습니다.</p>
              <p>회원 정보는 삭제되고, 보유한 커피콩은 소멸됩니다.</p><br />
              <div className='checkPw'>
                <label>{social ? '비밀번호' : '이메일'} 확인</label><br />
                <input
                  type="password"
                  value={pwInput}
                  onChange={(e) => setPwInput(e.target.value)}
                />
              </div>
              {!pwMatch && <p className="error-message">잘못된 {social ? '비밀번호' : '이메일'}입니다.</p>}

              <div className="buttonContainer">
                <button className='cancelBtn' onClick={closeWithdrawalModal}>취소</button>
                <button className='withdrawBtn' onClick={handleWithdrawal}>탈퇴 신청</button>
              </div>
            </div>
        
          </div>
        )}
      </div>
    </div>
  );
}

export default StoreUserInfo;
