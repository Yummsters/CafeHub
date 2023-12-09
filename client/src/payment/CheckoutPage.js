import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const clientKey = process.env.REACT_APP_TOSSPAYMENT_CLIENTKEY;
const secretKey = process.env.REACT_APP_TOSSPAYMENT_SECRETKEY;

export function CheckoutPage({price}) {
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
        { value: price }, // amount -> value(금액), currency(통화-기본KRW), country(국가-기본KR)
        { variantKey: "DEFAULT" } // 멀티 결제 UI를 사용할 때, 실제 UI 키 값 넣기
      );

      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    })();
  }, [price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;
    if (paymentMethodsWidget == null) { return; }
    paymentMethodsWidget.updateAmount(price); // 변경된 결제 금액 UI에 업데이트
  }, [price]);

  // swal
  const toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500
  })

  const onClick = async () => {
    const paymentWidget = paymentWidgetRef.current;
    if (price === 0) {
      toast.fire({
        icon: 'info',
        title: '충전할 금액을 선택해 주세요'
      })
      return;
    }
    try {
      await paymentWidget?.requestPayment({
        orderId : nanoid(),
        orderName: "포인트", // 수정 필요
        customerName: `${member.memNo}`,
        customerEmail: `${member.email}`,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`
      });
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <div >      
      <div id="payment-widget"/>
        <div className='purchaseWrap'>
          <button className='purchaseBtn' onClick={onClick}>{price}원 결제</button>
        </div>
    </div>
  );
}