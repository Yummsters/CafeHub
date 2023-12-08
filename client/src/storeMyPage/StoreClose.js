import React, { useState } from 'react';
import StoreSideTab from '../components/StoreSideTab';
import storeCloseStyle from './storeCloseStyle.css';
import { useNavigate } from 'react-router-dom';

const StoreClose = () => {
    const [isTerminationModalOpen, setIsTerminationModalOpen] = useState(true);
    const [passwordInput, setPasswordInput] = useState('');
    const navigate = useNavigate();

    const closeModal = () => {
        setIsTerminationModalOpen(false);
        navigate(-1);
    };

    const handleTerminationRequest = () => {
        // 여기에서 서비스 종료 신청 처리 로직을 추가
        // 비밀번호 확인 등의 로직을 수행하고, 정상적으로 처리되면 모달을 닫거나 필요에 따라 다른 동작 수행
        setIsTerminationModalOpen(false);
        // 예를 들어, 서비스 종료 신청 후 이전 페이지로 이동하는 등의 동작을 수행
        // navigate('/');
    };
    return (
        <div>
            <StoreSideTab />

            {/* 종료 신청 모달 */}
            {isTerminationModalOpen && (
                <div className="modal-overlay">
                    <div className="termination-modal">
                        <div className="closeBtn">
                            <img onClick={closeModal} src='/img/X.png' />
                        </div>
                        <div className="termination-modal-wrap">
                            <p>정말 서비스를 종료하시겠습니까?</p>
                            <p>카페 허브 서비스를 해지할 경우, 회원 정보와 가게 정보가 함께 삭제됩니다.</p>
                            <p>미정산 금액이 있는 경우 정산 후 해지가 가능합니다.</p>
                            <p>단, 커피콩을 100개 미만 보유한 경우 정산 없이 서비스가 종료됩니다.</p>
                            <div className="termination-passwordInput">
                                <label style={{ fontSize: "20px" }}>비밀번호 확인</label>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                />
                            </div>
                            <div className="termination-button-container">
                                <button className="cancelBtn" onClick={closeModal}>취소</button>
                                <button className="withdrawBtn" onClick={handleTerminationRequest}>종료 신청</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreClose;