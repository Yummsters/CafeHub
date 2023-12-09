import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Success = () => { // response 객체를 가지고 와서 추출하여 사용.
    const memNo = useSelector(state=>state.persistedReducer.member.memNo);
    const params = new URLSearchParams(window.location.search);

    const paymentData = {
        orderId: params.get('orderId'),
        paymentKey: params.get('paymentKey'),
        amount: params.get('amount'),
        memNo: memNo
    }
    console.log(paymentData);

useEffect(() => {
        axios
        .post('http://localhost:8080/payment/result', paymentData)
        .then((res) => {
            console.log(res);
            window.location.href = '/userPoint';
        })
        .catch((error) => {
            console.log(error);
        })
    }, [])

    return (
    <div>
      {/* {isSuccess === 'true' ? (
        <div>
          <h1>결제 성공</h1>
          <p>결과데이터: {responseStr}</p>
          <p>orderName: {orderName}</p>
          <p>method: {method}</p>
          {method === '카드' && <p>cardNumber: {cardNumber}</p>}
          {method === '가상계좌' && <p>accountNumber: {accountNumber}</p>}
          {method === '계좌이체' && <p>bank: {bank}</p>}
          {method === '휴대폰' && <p>customerMobilePhone: {customerMobilePhone}</p>}
        </div>
      ) : (
        <div>
          <h1>결제 실패</h1>
          <p>에러메시지: {message}</p>
          <p>에러코드: {code}</p>
        </div>
      )} */}
    </div>
    );
};

export default Success;