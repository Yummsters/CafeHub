import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";

const clientKey = process.env.REACT_APP_TOSSPAYMENT_CLIENTKEY;
const secretKey = process.env.REACT_APP_TOSSPAYMENT_SECRETKEY;

export function CheckoutPage({price}) {
  // console.log(price);
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
      const selectedPaymentMethod = paymentMethodsWidget.getSelectedPaymentMethod(); // 선택한 결제수단 전달
      // 응답은 type, method, easyPay, paymentMethodKey 

      const paymentAgreement = paymentWidget.renderAgreement( // 이용약관
        '#agreement', 
        { variantKey: 'AGREEMENT' }
      )

      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    })();
  }, []);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;
    if (paymentMethodsWidget == null) { return; }
    paymentMethodsWidget.updateAmount(price); // 변경된 결제 금액 UI에 업데이트
  }, [price]);

  return (
    <div >      
      {/* <div></div> */}
      <div id="payment-widget"/> <div id="agreement"/>
      <div className='purchaseWrap'><button className='purchaseBtn'
        onClick={async () => {
          const paymentWidget = paymentWidgetRef.current;
          try {
            await paymentWidget?.requestPayment({ // 선택한 결제수단의 결제창을 띄우는 메소드
              orderId: nanoid(), // 필수, 주문을 구분하는 ID, 무작위한 값 생성
              orderName: "포인트", // 필수, 주문명
              customerName: "김토스", // 선택, 고객 이름
              customerMobilePhone: "01011111111", // 선택, 고객 휴대폰 번호, 입금 안내 전송 등
              customerEmail: "customer123@gmail.com", // 선택, 해당 이메일로 결제 내용 통보
              successUrl: `${window.location.origin}/success`,
              failUrl: `${window.location.origin}/fail`
            });
          } catch (error) {
              console.log(error);
          }
        }}
      >
        {price}원 결제
      </button></div>
    </div>
  );
}