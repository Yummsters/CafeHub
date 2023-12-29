import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import paymentStyle from './paymentStyle.css'

const clientKey = process.env.REACT_APP_TOSSPAYMENT_CLIENTKEY;
const secretKey = process.env.REACT_APP_TOSSPAYMENT_SECRETKEY;

export function CheckoutPage({paymentData, children}) {
  const member = useSelector(state=>state.persistedReducer.member);
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [paymentModal, setPaymentModal] = useState(true);

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
        successUrl: `${window.location.origin}/payment/success?orderName=${paymentData.orderName}&memNo=${paymentData.memNo}`,
        failUrl: `${window.location.origin}/payment/fail`
      });
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <>
    <div className='paymentModal'>
      <div className='paymentModal-content'>
          <div id="payment-widget"/>
            <div className='purchaseWrap'>
              <div className="buttonContainer">
                {children}
                <button className='beanPurchaseBtn payGreen' onClick={onClick}>{paymentData.price}원 결제</button>
              </div>
            </div>
      </div>
    </div>
    </>
  );
}