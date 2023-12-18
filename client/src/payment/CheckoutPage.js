import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import paymentStyle from './paymentStyle.css'

const clientKey = process.env.REACT_APP_TOSSPAYMENT_CLIENTKEY;
const secretKey = process.env.REACT_APP_TOSSPAYMENT_SECRETKEY;

export function CheckoutPage({paymentData}) {
  const member = useSelector(state=>state.persistedReducer.member);
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);

  useEffect(() => {
    (async () => {
      // 결제위젯 SDK 초기화
      const paymentWidget = await loadPaymentWidget(clientKey, secretKey); // 회원 결제
      // 결제 UI 렌더링
      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        "#payment-widget", // selector 필수(UI를 렌더링할 위치 지정)
        { value: paymentData.price }, // amount -> value(금액), currency(통화-기본KRW), country(국가-기본KR)
        { variantKey: "DEFAULT" } // 멀티 결제 UI를 사용할 때, 실제 UI 키 값 넣기
      );

      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    })();
  }, [paymentData]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;
    if (paymentMethodsWidget == null) { return; }
    paymentMethodsWidget.updateAmount(paymentData.price); // 변경된 결제 금액 UI에 업데이트
  }, [paymentData.price]);

  const onClick = async () => {
    const paymentWidget = paymentWidgetRef.current;
    try {
      await paymentWidget?.requestPayment({
        orderId : nanoid(),
        orderName: `${paymentData.orderName}`,
        customerName: `${member.memNo}`,
        customerEmail: `${member.email}`,
        successUrl: `${window.location.origin}/payment/success?orderName=${paymentData.orderName}`,
        failUrl: `${window.location.origin}/payment/fail`
      });
    } catch(error) {
      console.log(error);
    }
  };

   console.log(paymentData.orderName);

  return (
    <>
    <div className='paymentModal'>
      <div className='paymentModal-content'>
        {/* <button className='closeBtn' onClick={closeModal}>X</button> */}
          <div id="payment-widget"/>
            <div className='purchaseWrap'>
              <button className='purchaseBtn' onClick={onClick}>{paymentData.price}원 결제</button>
              {/* <button className='purchaseBtn' onClick={onClick}>취소</button> */}
            </div>
      </div>
    </div>
    </>
  );
}