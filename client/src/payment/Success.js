import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { url } from '../config.js'

const Success = () => { // response 객체를 가지고 와서 추출하여 사용.
    const member = useSelector(state=>state.persistedReducer.member);
    const price = useSelector(state=>state.persistedReducer.payment.price);
    const params = new URLSearchParams(window.location.search);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false); // 결제 승인 여부
    const [showMsg, setShowMsg] = useState('결제 중...');

    const paymentData = {
        orderId: params.get('orderId'),
        paymentKey: params.get('paymentKey'),
        amount: params.get('amount'),
        orderName: params.get('orderName'),
        memNo: member && member.memNo ? member.memNo : params.get('memNo')
      }

    const onClick = () => {
      navigate(-1);
    }

    useEffect(() => {
        axios.post(`${url}/payment/result`, paymentData)
        .then((res) => {
            setIsSuccess(true);
            setTimeout(() => {
              setShowMsg(`${paymentData.amount}원 결제 완료`);
            }, 1500);
            dispatch({type:"payment", payload: { isSuccess: true, paymentKey: paymentData.paymentKey, memNo: paymentData.memNo, price: paymentData.amount}});
        })
        .catch((error) => {
            console.log(error);
            setTimeout(() => {
              setShowMsg(`결제 실패`);
            }, 1500);
        })
    }, [])

    return (
    <div>
      <div className='paymentModal'>
        <div className='paymentModal-content'>
            <div className='payment-result-box'>
              <p className='payment-result'>{showMsg}</p>
              <button className='beanPurchaseBtn' onClick={onClick}>확인</button>
            </div>
          </div>
        </div>
    </div>
    );
};

export default Success;