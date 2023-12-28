import React, { useState } from 'react';
import StoreSideTab from '../components/StoreSideTab';
import storeCloseStyle from './storeCloseStyle.css';
import { useNavigate } from 'react-router-dom';
import { removeCookie} from '../components/Cookie';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import { url } from '../config.js'
import { Toast } from '../components/Toast.js';

const StoreClose = () => {
    const [isTerminationModalOpen, setIsTerminationModalOpen] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pwInput, setPwInput] = useState('');
    const [pwMatch, setPwMatch] = useState(true);
    const memNo = useSelector(state=>state.persistedReducer.member.memNo);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);

    const closeModal = () => {
        setIsTerminationModalOpen(false);
        navigate(-1);
    };

    const handleWithdrawal = (e) => {  
        
        // 자체 로그인 회원 탈퇴
        axios.post(`${url}/member/delete/normal/${memNo}`,{
          password : pwInput
        },
        {
          headers : {
            Authorization :accessToken,
            'Content-Type': 'application/json'
          }
        })
        .then(res=>{
            const isPwCorrect =res.data;
    
            if (isPwCorrect) {
                setPwInput(true);
                removeCookie("accessToken");
                dispatch({type:"isLogin", payload:false});
                dispatch({type:"member", payload:''});
                dispatch({type:"accessToken", payload:""});
                dispatch({type:"cafe", payload:""});
                Toast('success', '회원탈퇴가 완료되었습니다')
                .then(()=>{
                    navigate("/");
                })
            } else {
                // 비밀번호가 일치하지 않을 때
                setPwMatch(false);
            }
        })
        .catch(err=>{
            console.log(err);
            if(err.data === '포인트 정산 후 탈퇴가 가능합니다'){
                Toast('success', '포인트 정산 후 탈퇴가 가능합니다')
            }else{
                Toast('success', '정산 대기중인 포인트가 있습니다\n포인트 정산 후 탈퇴가 가능합니다')
            }
        })
      };

    return (
        <div>
            <StoreSideTab />

            {/* 종료 신청 모달 */}
            {isTerminationModalOpen && (
                <div className="modal-overlay">
                    <div className="termination-modal">
                        <div className="termination-modal-wrap">
                            <p>정말 서비스를 종료하시겠습니까?</p>
                            <p>카페 허브 서비스를 해지할 경우, 회원 정보와 카페 정보가 함께 삭제됩니다.</p>
                            <p>미정산 금액이 있는 경우 정산 후 해지가 가능합니다.</p>
                            <p>단, 커피콩을 100개 미만 보유한 경우 정산 없이 서비스가 종료됩니다.</p>
                            <div className="termination-passwordInput">
                                <label> <span className='storeClost-pwCheck'>비밀번호 확인</span>
                                <input
                                    type="password"
                                    value={pwInput}
                                    onChange={(e) => setPwInput(e.target.value)}
                                    /></label>
                            </div>
                            {!pwMatch ? <p className="error-message">잘못된 비밀번호입니다.</p> : <p className='error-message-blank'> &nbsp; </p>}
                            <div className="termination-button-container">
                                <button className="cancelBtn" onClick={closeModal}>취소</button>
                                <button className="withdrawBtn" onClick={handleWithdrawal}>종료 신청</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreClose;