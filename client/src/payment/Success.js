import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Success = () => { // response 객체를 가지고 와서 추출하여 사용.
    const memNo = useSelector(state=>state.persistedReducer.member.memNo);
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const params = new URLSearchParams(window.location.search);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false); // 결제 승인 여부

    const paymentData = {
        orderId: params.get('orderId'),
        paymentKey: params.get('paymentKey'),
        amount: params.get('amount'),
        orderName: params.get('orderName'),
        memNo: memNo
    }

    const onClick = () => {
      navigate(-1);
    }

    console.log(paymentData.orderName);
    useEffect(() => {
        axios
        .post('http://localhost:8080/payment/result', paymentData)
        .then((res) => {
            console.log(res);
            setIsSuccess(true);
            dispatch({type:"payment", payload: { price: paymentData.amount, isSuccess: true }});
            // if (paymentData.orderName === '포인트구매') {
            //   buyPoint();
            // }
        })
        .catch((error) => {
            console.log(error);
        })
    }, [])

    // const buyPoint = () => {
    //   axios.post(`http://localhost:8080/point/buyPoint/${memNo}/${paymentData.amount/100}`,
    //   {
    //       headers : {
    //           Authorization : accessToken
    //       }
    //   })
    //   .then((res)=>{
    //       console.log(res.data);
    //   })
    //   .catch((error) =>{
    //       console.log(error);
    //   })
    // }

    return (
    <div>
      
      {isSuccess ? (
          <div className='paymentModal'>
          <div className='paymentModal-content'>
                <div className='payment-result-box'>
                  <p className='payment-result'>{paymentData.amount}원 결제 완료</p>
                  <button className='purchaseBtn' onClick={onClick}>확인</button>
                </div>
          </div>
        </div>
      ) : (
        <div className='paymentModal'>
        <div className='paymentModal-content'>
            <div className='payment-result-box'>
              <p className='payment-result'>결제 실패</p>
              <button className='purchaseBtn' onClick={onClick}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>

    );
};

export default Success;