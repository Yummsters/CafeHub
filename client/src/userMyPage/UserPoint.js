import React, { createContext, useContext, useEffect, useState } from 'react';
import './UserPointStyle.css';
import UserSideTab from '../components/UserSideTab';
import { CheckoutPage } from '../payment/CheckoutPage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const UserPoint = () => {
    const accessToken = useSelector(state => state.persistedReducer.accessToken);
    const member = useSelector(state => state.persistedReducer.member);
    const dispatch = useDispatch();
    const [myPoint, setMyPoint] = useState(0); // 회원의 보유 포인트
    const [selectPrice, setSelectPrice] = useState(0); // 선택한 가격 보여주기
    const [price, setPrice] = useState(1000); // 페이먼트로 전달할 가격
    const [badgeName, setBadge] = useState([]);//배지
    const [selectedBadges, setSelectedBadges] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [pickBadgeName, setPickBadge] = useState([]);


    // swal
    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500
    })

    // 테스트
    // const { updatePaymentInfo } = useContext(PaymentContext);
    const paySuccess = useSelector(state => state.persistedReducer.payment.isSuccess);

    const [paymentModal, setPaymentModal] = useState(false);
    const paymentData = { price: price, orderName: "포인트구매" };
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

    const badgeClick = (badgeIndex) => {
        const selectedBadge = badgeName[badgeIndex];

        if (myPoint < 10) {
            toast.fire({
                icon: 'info',
                title: '포인트를 충전해주세요'
            });
            return;
        }

        Swal.fire({
            title: '배지를 구매하시겠습니까?',
            text: '이용기간은 30일 입니다',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니오',
            allowOutsideClick: false, 
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`http://localhost:8080/buyBadge/${member.memNo}/${selectedBadge.badgeNo}`)
                .then((res) => {
                    console.log('뱃지를 성공적으로 달았습니다:', res.data);

                    toast.fire({
                        icon: 'success',
                        title:  '배지 구매 성공!'
                    }).then(() => {
                        window.location.reload();
                    });
                })
                    .catch((error) => {
                        console.error('뱃지 구매 중 오류 발생:', error);
                    });
            }
        });
    };

    const userBadgeClick = (badgeIndex) => {
        const selectedBadge = userBadges[badgeIndex];

        Swal.fire({
            title: '배지를 착용하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니오',
            allowOutsideClick: false, 
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`http://localhost:8080/pickBadge/${member.memNo}/${selectedBadge.memberBadgeNo}`)
                    .then((res) => {
                    
                        toast.fire({
                            icon: 'success',
                            title:  '배지 달기 성공!'
                        }).then(() => {
                            window.location.reload();
                        });
                    })
                    .catch((error) => {
                        console.error('뱃지 착용 중 오류 발생:', error);
                    });
            }
        });
    };
    const defaultBadge = () => {
       
        Swal.fire({
            title: '배지를 착용하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: '아니오',
            allowOutsideClick: false, 
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`http://localhost:8080/defaultBadge/${member.memNo}`)
                .then((res) => {
                    console.log('뱃지를 성공적으로 달았습니다:', res.data);

                    toast.fire({
                        icon: 'success',
                        title:  '배지 달기 성공!'
                    }).then(() => {
                        window.location.reload();
                    });
                })
                    .catch((error) => {
                        console.error('뱃지 착용 중 오류 발생:', error);
                    });
            }
        });
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/member/point/${member.memNo}`,
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
        axios.get(`http://localhost:8080/badgeList`)
            .then(res => {
                console.log(res.data);
                setBadge([...res.data]);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    useEffect(() => {

        if (member && member.memNo) {
            axios.get(`http://localhost:8080/badge/${member.memNo}`)
                .then(response => {
                    console.log(response.data);
                    setUserBadges(response.data);
                })
                .catch(error => {
                    console.error('에러 발생:', error);
                });
        }
    }, []);
    useEffect(() => {
        axios.get(`http://localhost:8080/getMemberBadge/${member.memNo}`)
            .then(response => {

                const badgeName = response.data.badgeName || '';
                setPickBadge([badgeName]);

            })
            .catch(error => {
                console.error('에러 발생:', error);
            });
    }, []);


    useEffect(() => {
        if (paySuccess) {
            axios.post(`http://localhost:8080/point/buyPoint/${member.memNo}/${price / 100}`,
                {
                    headers: {
                        Authorization: accessToken
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    dispatch({ type: "payment", payload: { price: 0, isSuccess: false } });
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }, [])

    return (
        <div className='mypage'>
            <UserSideTab />
            <div className='userPointBox'>
                <div className='nicknameBox'>
                    <p><img className='badgeImage' src={`/img/${pickBadgeName[0]}`} alt="house" /></p>
                    <p>{member.nickname} 님의 보유 커피콩</p>
                    <p><img src="/img/countPoint.png" alt="house" width={"40px"} /></p>
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

                    <button className='beanPurchaseBtn' onClick={paymentOpen}>{price}원 결제</button>
                    {paymentModal && (
                        <CheckoutPage paymentData={paymentData} />)}
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
    );
};

export default UserPoint;