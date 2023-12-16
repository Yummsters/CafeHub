import React, { createContext, useContext, useEffect, useState } from 'react';
import './UserPointStyle.css';
import UserSideTab from '../components/UserSideTab';
import { CheckoutPage } from '../payment/CheckoutPage';
import { PaymentContext } from '../payment/PaymentContext';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router';

const UserPoint = () => {
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const member = useSelector(state => state.persistedReducer.member);
    const payment = useSelector(state=>state.persistedReducer.payment.isSuccess);
    const dispatch = useDispatch();
    const [myPoint, setMyPoint] = useState(0); // 회원의 보유 포인트

    const [selectPrice, setSelectPrice] = useState(0); // 선택한 가격 보여주기
    const [price, setPrice] = useState(1000); // 페이먼트로 전달할 가격

    // swal
    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500
    })

    // 테스트
    // const { updatePaymentInfo } = useContext(PaymentContext);
    const [paymentModal, setPaymentModal] = useState(false);
    const paymentData = {price: price, orderName: "포인트구매"};
    const paymentOpen = () => {
        if (paymentData.price === 0) {
            toast.fire({
              icon: 'info',
              title: '충전할 금액을 선택해 주세요'
            })
            return;
          }
        setPaymentModal(true);
    }
    // 테스트 끝

    const coffeeData = [
        { beansCount: 10, price: 1000 },
        { beansCount: 30, price: 3000 },
        { beansCount: 50, price: 5000 },
        { beansCount: 100, price: 10000 },
        { beansCount: 300, price: 30000 },
    ];

    const priceClick = (price, index) => {
        setPrice(price);
        setSelectPrice(index);
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/point/${member.memNo}`,
        {
            headers : {
                Authorization : accessToken
            }
        })
        .then((res)=>{
            setMyPoint(res.data);
        })
        .catch((error) =>{
            console.log(error);
        })
    }, [])

    return (
        <div className='mypage'>
            <UserSideTab />
            <div className='userPointBox'>
                <div className='nicknameBox'>
                    <p><img src="/img/macaroon.png" alt="house" />{member.nickname} 님의 보유 커피콩</p>
                    <p><img src="/img/coffeebeans.png" alt="house" /></p>
                    <p>{myPoint}개</p>
                </div>

                <div className='coffeebeanBox'>
                    <div className='infoTitle'>커피콩 충전</div>
                    <div className='pointContent'>
                        {coffeeData.map((coffee, index) => (
                            <div className={`${selectPrice === index ? 'selectBox' : 'coffeeBox'}`} onClick={()=>priceClick(coffee.price, index)} key={index}>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" />
                                <img src="/img/X.png" alt="X" width={"25px"} height={"25px"} />{coffee.beansCount}</p>
                                <div>{coffee.price}원</div>

                            </div>
                        ))}
                    </div>

                    <button className='purchaseBtn' onClick={paymentOpen}>{price}원 결제</button>
                    {paymentModal && (
                        <CheckoutPage paymentData={paymentData} />)}
                    {/* <div><CheckoutPage price={price}/></div> */}
                </div>


                <div className='badgeWrap'>
                    <div className='notOwnBadgeBox'>
                        <div className='ownTitle'>
                            <p>뱃지 구매</p>
                        </div>
                        <div className='badgeContent1'>
                            <div className='badgeBox'>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                            </div>
                        </div>
                    </div>

                    <div className='ownBadgeBox'>
                        <div className='ownTitle'>
                            <p>보유중인 뱃지</p>
                        </div>
                        <div className='badgeContent2'>
                            <div className='badgeBox'>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                                <p><img src="/img/coffeebeans.png" alt="coffebeans" /></p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserPoint;