import React, { createContext, useContext, useEffect, useState } from 'react';
import './UserPointStyle.css';
import UserSideTab from '../components/UserSideTab';
import { CheckoutPage } from '../payment/CheckoutPage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { url } from '../config.js'
import { checkToLogin, normalCheck } from '../login/TokenCheck.js';
import { useNavigate } from 'react-router';
import { Toast, ToastBtn } from '../components/Toast.js';
import { getCookie, setCookie, removeCookie } from '../components/Cookie';

import { tokenCreate, tokenExpried,checkLogin } from "../login/TokenCheck.js";

const UserPoint = () => {
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const member = useSelector(state => state.persistedReducer.member);
    const isLogin = useSelector(state => state.persistedReducer.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [myPoint, setMyPoint] = useState(0); // 회원의 보유 포인트
    const [selectPrice, setSelectPrice] = useState(0); // 선택한 가격 보여주기
    const [price, setPrice] = useState(1000); // 페이먼트로 전달할 가격
    const [badgeName, setBadge] = useState([]);//배지
    const [selectedBadges, setSelectedBadges] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [pickBadgeName, setPickBadge] = useState([]);

    // 페이먼트 관련
    const payment = useSelector(state => state.persistedReducer.payment);
    const [paymentModal, setPaymentModal] = useState(false);
    const paymentData = { price: price, orderName: "포인트구매", memNo: member.memNo};
    const paymentOpen = () => {
        if (isLogin) {
            checkToLogin(dispatch, accessToken, navigate)
        }
        setPaymentModal(true);
    }
    const paymentClose = () => {
        if (isLogin) {
            checkToLogin(dispatch, accessToken, navigate)
        }
        setPaymentModal(false);
    }

    const refund = (cancelReason) => {
        return new Promise((resolve, reject) => {
            const data = {
                cancelReason: cancelReason,
                paymentKey: payment.paymentKey
            };
            axios.post(`${url}/payment/refund`, data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })
    }

    useEffect(() => {
        if (payment.isSuccess) {
            axios.post(`${url}/buyPoint/${member.memNo}/${Number(payment.price) / 100}`)
                .then((res) => {
                    dispatch({ type: "payment", payload: "" })
                    Toast('success', '포인트 적립이 완료되었습니다')
                })
                .catch((error) => {
                    console.log(error);
                    refund('포인트등록실패')
                    dispatch({ type: "payment", payload: "" })
                    Toast('error', '포인트 적립에 실패했습니다')
                })
        }
    }, [])

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
    const badgeClick = (badgeIndex) => {
        const selectedBadge = badgeName[badgeIndex];
        checkLogin(dispatch, accessToken, isLogin, navigate)
        
        if (myPoint < 10) {
            Toast('error', '포인트를 충전해주세요');
            return;
        }
    
        ToastBtn('question', '배지를 구매하시겠습니까?', '이용기간은 30일 입니다')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(`${url}/user/buyBadge/${member.memNo}/${selectedBadge.badgeNo}`, {}, {
                        headers: {
                            Authorization: accessToken,
                            Refresh: getCookie("refreshToken")
                        }
                    })
                    .then((response) => {
                        Toast('success', '배지 구매가 완료되었습니다')
                        .then(() => {
                            window.location.reload();
                        });
                        tokenCreate(dispatch, setCookie, response.headers);
                    })
                    .catch((error) => {
                        console.error(error);
                        if (error.response !== undefined) {
                            tokenExpried(dispatch, removeCookie, error.response.data, navigate);
                        }
                    });
                }
            });
    };
    const userBadgeClick = (badgeIndex) => {
        checkLogin(dispatch, accessToken, isLogin, navigate)
        const selectedBadge = userBadges[badgeIndex];
    
        ToastBtn('question', '배지를 변경하시겠습니까?', '')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(`${url}/user/pickBadge/${member.memNo}/${selectedBadge.memberBadgeNo}`, {}, {
                        headers: {
                            Authorization: accessToken,
                            Refresh: getCookie("refreshToken")
                        }
                    })
                        .then((response) => {
                            tokenCreate(dispatch, setCookie, response.headers);
                            Toast('success', '배지가 변경되었습니다')
                                .then(() => {
                                    window.location.reload();
                                });
                        })
                        .catch((error) => {
                            if (error.response !== undefined) {
                                tokenExpried(dispatch, removeCookie, error.res.data, navigate);
                            }
                            console.error(error);
                        });
                }
            });
    };
    const defaultBadge = () => {
        checkLogin(dispatch, accessToken, isLogin, navigate)
        ToastBtn('question', '배지를 변경하시겠습니까?', '')
            .then((result) => {
                if (result.isConfirmed) {
                    axios.post(`${url}/user/defaultBadge/${member.memNo}`, {}, {
                        headers: {
                            Authorization: accessToken,
                            Refresh: getCookie("refreshToken")
                        }
                    })
                        .then((response) => {
                            tokenCreate(dispatch, setCookie, response.headers);
                            Toast('success', '배지가 변경되었습니다')
                                .then(() => {
                                    window.location.reload();
                                });
                        })
                        .catch((error) => {
                            if (error.response !== undefined) {
                                tokenExpried(dispatch, removeCookie, error.response.data, navigate);
                            }
                            console.error(error);
                        });
                }
            });
    };
    
    useEffect(() => {
        if (isLogin) {
            normalCheck(dispatch, accessToken)
        }
        axios.get(`${url}/member/point/${member.memNo}`,
            {
                headers: {
                    Authorization: accessToken
                }
            })
            .then((res) => {
                setMyPoint(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    useEffect(() => {
        axios.get(`${url}/user/badgeList`,{
            headers: {
                Authorization: accessToken,
                Refresh: getCookie("refreshToken")
            }
        })
            .then(response => {
                tokenCreate(dispatch, setCookie, response.headers)
                setBadge([...response.data]);
            })
            .catch(err => {
                if (err.response !== undefined) {
                    tokenExpried(dispatch, removeCookie, err.response.data, navigate);
                }
                console.log(err);
            })
    }, [])

    useEffect(() => {
        if (member && member.memNo) {
            axios.get(`${url}/user/badge/${member.memNo}`,{
                headers: {
                    Authorization: accessToken,
                    Refresh: getCookie("refreshToken")
                }
            })
                .then(response => {
                    tokenCreate(dispatch, setCookie, response.headers)
                    setUserBadges(response.data);
                })
                .catch(error => {
                    if (error.response !== undefined) {
                        tokenExpried(dispatch, removeCookie, error.response.data, navigate);
                    }
                    console.error(error);
                });
        }
    }, []);

    useEffect(() => {
        axios.get(`${url}/getMemberBadge/${member.memNo}`, {
            headers: {
                Authorization: accessToken,
                Refresh: getCookie("refreshToken")
            }
        }
        )
            .then(response => {
                tokenCreate(dispatch, setCookie, response.headers)
                    .then(() => {
                        const badgeName = response.data.badgeName || '';
                        setPickBadge([badgeName]);
                    })
            })
            .catch(error => {
                if (error.response !== undefined) {
                    tokenExpried(dispatch, removeCookie, error.response.data, navigate);
                }
                console.error(error);
            });
    }, []);

    return (
        <>
            <div className='mypage'>
                <UserSideTab />
                <div className='userPointBox'>
                    <div className='nicknameBox'>
                        <p><img className='badgeImage' src={`/img/${pickBadgeName[0]}`} alt="house" /></p>
                        <p>{member.nickname} 님의 보유 커피콩</p>
                        <p>&nbsp;&nbsp;&nbsp;<img src="/img/countPoint.png" alt="house" width={"40px"} /></p>
                        <p>{myPoint}개</p>
                    </div>

                    <div className='coffeebeanBox'>
                        <div className='infoTitle'>커피콩 충전</div>
                        <div className='pointContent'>
                            {coffeeData.map((coffee, index) => (
                                <div className={`${selectPrice === index ? 'selectBox' : 'coffeeBox'}`} onClick={() => priceClick(coffee.price, index)} key={index}>
                                    <p><img src="/img/coffeebeans.png" alt="coffebeans" width={"40px"} />
                                        &nbsp;×&nbsp;{coffee.beansCount}</p>
                                    <div>{coffee.price}원</div>
                                </div>
                            ))}
                        </div>
                        <div className='coffeebeanPayment'>
                            <button className='beanPurchaseBtn' onClick={paymentOpen}>{price}원 결제</button>
                        </div>
                    </div>
                    <div className='badgeWrap'>
                        <div className='notOwnBadgeBox'>
                            <div className='ownTitle'>
                                <p>배지 구매 <img src="/img/coffeebeans.png" alt="coffebeans" width={"30px"} />
                                    &nbsp;×&nbsp;10</p>
                            </div>
                            <div className='badgeContent1'>
                                <div className='badgeBox'>
                                    <div className='badgeRow1'>
                                        {badgeName.map((badge, i) => {
                                            const isBadgeOwned = userBadges.some(userBadge => userBadge.badgeName === badge.badgeName);

                                            if (!isBadgeOwned) {
                                                return (
                                                    <img
                                                        key={i}
                                                        src={`/img/${badge.badgeName}`}
                                                        className={`badgeImage ${selectedBadges.includes(i) ? 'selectBadges' : 'badges'}`}
                                                        onClick={() => badgeClick(i)}
                                                        alt={`배지 ${i + 1}`}
                                                    />
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='ownBadgeBox'>
                            <div className='ownTitle'>
                                <p>보유중인 배지</p>

                            </div>
                            <div className='badgeContent2'>
                                <div className='badgeBox'>
                                    <div className='badgeRow1'>
                                        {userBadges.map((badge, i) => (
                                            <img
                                                key={i}
                                                src={`/img/${badge.badgeName}`}
                                                className={`badgeImage ${selectedBadges.includes(i) ? 'selectBadges' : 'badges'}`}
                                                onClick={() => userBadgeClick(i)}
                                                alt={`배지 ${i + 1}`}
                                            />
                                        ))}
                                        <img
                                            src={`/img/9.png`}
                                            className='badgeImage'
                                            onClick={defaultBadge}
                                            alt={`기본 배지`}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {paymentModal && (
                <>
                    <CheckoutPage paymentData={paymentData}>
                        <button className='beanPurchaseBtn' onClick={paymentClose}>취소</button>
                    </CheckoutPage>
                </>
            )}
        </>
    );
};

export default UserPoint;